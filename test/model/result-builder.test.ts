import { FakeCriterion, FakeOption, FakeRating } from "../helpers/fake";
import type { ResultBuilder } from "../../src/model/result-builder";
import { CriterionResult, UserResult } from "../../src/types/result";

jest.unmock("lodash");
jest.unmock("../helpers/fake");

const runScript = () => jest.requireActual("../../src/model/result-builder");

class Harness {
  options = [
    new FakeOption({ id: "option1" }),
    new FakeOption({ id: "option2" }),
  ];
  readyUsers = [
    { id: "userId", normalized: 0.5 },
    { id: "collaborator", normalized: 0.5 },
  ];
  readyCriteria = [
    { ...new FakeCriterion({ id: "criterion1" }), normalized: 0.5 },
    { ...new FakeCriterion({ id: "criterion2" }), normalized: 0.5 },
    {
      ...new FakeCriterion({ id: "criterion3", user: { id: "collaborator" } }),
      normalized: 0.5,
    },
    {
      ...new FakeCriterion({ id: "criterion4", user: { id: "collaborator" } }),
      normalized: 0.5,
    },
  ];
  readyRatings = [
    {
      ...new FakeRating({
        optionId: "option1",
        criterionId: "criterion1",
        weight: 1,
      }),
      normalized: 0,
    },
    {
      ...new FakeRating({
        optionId: "option2",
        criterionId: "criterion1",
        weight: 2,
      }),
      normalized: 1,
    },
    {
      ...new FakeRating({
        optionId: "option1",
        criterionId: "criterion2",
        weight: 1,
      }),
      normalized: 0,
    },
    {
      ...new FakeRating({
        optionId: "option2",
        criterionId: "criterion2",
        weight: 2,
      }),
      normalized: 1,
    },
    {
      ...new FakeRating({
        optionId: "option1",
        criterionId: "criterion3",
        user: { id: "collaborator" },
        weight: 1,
      }),
      normalized: 0,
    },
    {
      ...new FakeRating({
        optionId: "option2",
        criterionId: "criterion3",
        user: { id: "collaborator" },
        weight: 2,
      }),
      normalized: 1,
    },
    {
      ...new FakeRating({
        optionId: "option1",
        criterionId: "criterion4",
        user: { id: "collaborator" },
        weight: 2,
      }),
      normalized: 1,
    },
    {
      ...new FakeRating({
        optionId: "option2",
        criterionId: "criterion4",
        user: { id: "collaborator" },
        weight: 1,
      }),
      normalized: 0,
    },
  ];
  builder: ResultBuilder;
  create() {
    const { ResultBuilder } = runScript();
    this.builder = new ResultBuilder(
      this.options,
      this.readyUsers,
      this.readyCriteria,
      this.readyRatings
    );
  }
  getCriterionResults() {
    if (!this.builder) {
      this.create();
    }
    return this.builder.getCriterionResults();
  }
  getUserResults(criterionResults?: CriterionResult[]) {
    if (!this.builder) {
      this.create();
    }
    if (!criterionResults) {
      criterionResults = this.builder.getCriterionResults();
    }
    return this.builder.getUserResults(criterionResults);
  }
  getOptionResults(userResults?: UserResult[]) {
    if (!this.builder) {
      this.create();
    }
    if (!userResults) {
      const criterionResults = this.builder.getCriterionResults();
      userResults = this.builder.getUserResults(criterionResults);
    }
    return this.builder.getOptionResults(userResults);
  }
}

describe("result builder model", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  describe("getCriterionResults", () => {
    it("should return criterion without results if ratings not found", () => {
      harness.readyRatings = [];
      harness.create();
      const result = harness.getCriterionResults();
      expect(result).toEqual([
        {
          ...harness.readyCriteria[0],
          results: undefined,
        },
        {
          ...harness.readyCriteria[1],
          results: undefined,
        },
        {
          ...harness.readyCriteria[2],
          results: undefined,
        },
        {
          ...harness.readyCriteria[3],
          results: undefined,
        },
      ]);
    });
    it("should return criterion without results if options not found", () => {
      harness.options = [];
      harness.create();
      const result = harness.getCriterionResults();
      expect(result).toEqual([
        {
          ...harness.readyCriteria[0],
          results: undefined,
        },
        {
          ...harness.readyCriteria[1],
          results: undefined,
        },
        {
          ...harness.readyCriteria[2],
          results: undefined,
        },
        {
          ...harness.readyCriteria[3],
          results: undefined,
        },
      ]);
    });
    it("should return criterion without results if ratings tied", () => {
      harness.readyRatings.forEach((rating) => (rating.normalized = undefined));
      harness.create();
      const result = harness.getCriterionResults();
      expect(result).toEqual([
        {
          ...harness.readyCriteria[0],
          results: undefined,
        },
        {
          ...harness.readyCriteria[1],
          results: undefined,
        },
        {
          ...harness.readyCriteria[2],
          results: undefined,
        },
        {
          ...harness.readyCriteria[3],
          results: undefined,
        },
      ]);
    });
    it("should return criterion with ranked and sorted results", () => {
      harness.create();
      const result = harness.getCriterionResults();
      expect(result).toEqual([
        {
          ...harness.readyCriteria[0],
          results: [
            { ...harness.options[1], rank: 1, score: 0.5 },
            { ...harness.options[0], rank: 2, score: 0 },
          ],
        },
        {
          ...harness.readyCriteria[1],
          results: [
            { ...harness.options[1], rank: 1, score: 0.5 },
            { ...harness.options[0], rank: 2, score: 0 },
          ],
        },
        {
          ...harness.readyCriteria[2],
          results: [
            { ...harness.options[1], rank: 1, score: 0.5 },
            { ...harness.options[0], rank: 2, score: 0 },
          ],
        },
        {
          ...harness.readyCriteria[3],
          results: [
            { ...harness.options[0], rank: 1, score: 0.5 },
            { ...harness.options[1], rank: 2, score: 0 },
          ],
        },
      ]);
    });
  });
  describe("getUserResults", () => {
    it("should return users without results if criterion not found", () => {
      const result = harness.getUserResults([]);
      expect(result).toEqual([
        { ...harness.readyUsers[0], results: undefined },
        { ...harness.readyUsers[1], results: undefined },
      ]);
    });
    it("should return users without results if ratings are tied", () => {
      harness.readyRatings[7].normalized = undefined;
      harness.readyRatings[7].normalized = undefined;
      const result = harness.getUserResults();
      expect(result).toEqual([
        {
          ...harness.readyUsers[0],
          results: [
            { ...harness.options[1], rank: 1, score: 0.5 },
            { ...harness.options[0], rank: 2, score: 0 },
          ],
        },
        { ...harness.readyUsers[1], results: undefined },
      ]);
    });
    it("should return user with ranked and score results", () => {
      const result = harness.getUserResults();
      expect(result).toEqual([
        {
          ...harness.readyUsers[0],
          results: [
            { ...harness.options[1], rank: 1, score: 0.5 },
            { ...harness.options[0], rank: 2, score: 0 },
          ],
        },
        {
          ...harness.readyUsers[1],
          results: [
            { ...harness.options[1], rank: 1, score: 0.25 },
            { ...harness.options[0], rank: 1, score: 0.25 },
          ],
        },
      ]);
    });
  });
  describe("getOptionResults", () => {
    it("should skip users who haven't finished rating", () => {
      harness.readyRatings[7].normalized = undefined;
      harness.readyRatings[7].normalized = undefined;
      const result = harness.getOptionResults();
      expect(result).toEqual([
        { ...harness.options[1], rank: 1, score: 0.5 },
        { ...harness.options[0], rank: 2, score: 0 },
      ]);
    });
    it("should return the options ranked and sorted", () => {
      const result = harness.getOptionResults();
      expect(result).toEqual([
        { ...harness.options[1], rank: 1, score: 0.75 },
        { ...harness.options[0], rank: 2, score: 0.25 },
      ]);
    });
  });
});
