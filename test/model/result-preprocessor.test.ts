import { FakeCriterion, FakeOption, FakeRating } from "../helpers/fake";
import type { ResultPreprocessor } from "../../src/model/result-preprocessor";
import { CriterionReady, UserReady } from "../../src/types/result";

jest.unmock("lodash");
jest.unmock("../helpers/fake");

const runScript = () =>
  jest.requireActual("../../src/model/result-preprocessor");

class Harness {
  options = [
    new FakeOption({ id: "option1" }),
    new FakeOption({ id: "option2" }),
  ];
  criteria = [
    new FakeCriterion({ id: "criterion1" }),
    new FakeCriterion({ id: "criterion2" }),
    new FakeCriterion({ id: "criterion3", user: { id: "collaborator" } }),
    new FakeCriterion({ id: "criterion4", user: { id: "collaborator" } }),
  ];
  ratings = [
    new FakeRating({
      optionId: "option1",
      criterionId: "criterion1",
      weight: 1,
    }),
    new FakeRating({
      optionId: "option2",
      criterionId: "criterion1",
      weight: 2,
    }),
    new FakeRating({
      optionId: "option1",
      criterionId: "criterion2",
      weight: 1,
    }),
    new FakeRating({
      optionId: "option2",
      criterionId: "criterion2",
      weight: 2,
    }),
    new FakeRating({
      optionId: "option3",
      criterionId: "criterion3",
      user: { id: "collaborator" },
      weight: 1,
    }),
    new FakeRating({
      optionId: "option4",
      criterionId: "criterion3",
      user: { id: "collaborator" },
      weight: 2,
    }),
    new FakeRating({
      optionId: "option3",
      criterionId: "criterion4",
      user: { id: "collaborator" },
      weight: 1,
    }),
    new FakeRating({
      optionId: "option4",
      criterionId: "criterion4",
      user: { id: "collaborator" },
      weight: 2,
    }),
  ];
  preprocessor: ResultPreprocessor;

  enter(state: string) {
    switch (state) {
      case "notenoughcriteria":
        this.criteria.length = 3;
        this.ratings.length = 6;
        break;
      case "noratings":
        this.ratings.length = 4;
        break;
      case "badratings":
        this.ratings.length = 7;
        break;
      case "ratingstie":
        this.ratings[7].weight = 1;
      case "allready":
        break;
    }
  }

  create() {
    const { ResultPreprocessor } = runScript();
    this.preprocessor = new ResultPreprocessor(
      this.options,
      this.criteria,
      this.ratings
    );
  }

  getCriteria(users?: UserReady[]) {
    if (!this.preprocessor) {
      this.create();
    }
    if (!users) {
      users = this.preprocessor.getUsers();
    }
    return this.preprocessor.getCriteria(users);
  }

  getRatings(criteria?: CriterionReady[]) {
    if (!this.preprocessor) {
      this.create();
    }
    if (!criteria) {
      const users = this.preprocessor.getUsers();
      criteria = this.preprocessor.getCriteria(users);
    }
    return this.preprocessor.getRatings(criteria);
  }

  getUsers() {
    if (!this.preprocessor) {
      this.create();
    }
    return this.preprocessor.getUsers();
  }
}

describe("result preprocessor model", () => {
  let harness: Harness;
  beforeEach(() => {
    harness = new Harness();
  });
  describe("getUsers", () => {
    it("should ignore users without two criteria", () => {
      harness.enter("notenoughcriteria");
      const result = harness.getUsers();
      expect(result).toEqual([
        {
          id: "userId",
          normalized: 1,
        },
      ]);
    });
    it("should ignore users without ratings", () => {
      harness.enter("noratings");
      const result = harness.getUsers();
      expect(result).toEqual([
        {
          id: "userId",
          normalized: 1,
        },
      ]);
    });
    it("should ignore users with bad ratings count", () => {
      harness.enter("badratings");
      const result = harness.getUsers();
      expect(result).toEqual([
        {
          id: "userId",
          normalized: 1,
        },
      ]);
    });
    it("should return users with normalized weights", () => {
      harness.enter("allready");
      const result = harness.getUsers();
      expect(result).toEqual([
        {
          id: "userId",
          normalized: 0.5,
        },
        {
          id: "collaborator",
          normalized: 0.5,
        },
      ]);
    });
  });
  describe("getCriteria", () => {
    it("should ignore unknown users", () => {
      harness.enter("allready");
      const result = harness.getCriteria([{ id: "baduser", normalized: 1 }]);
      expect(result).toEqual([]);
    });
    it("should return criteria with normalized weights", () => {
      const result = harness.getCriteria();
      expect(result).toEqual([
        { ...harness.criteria[0], normalized: 0.5 },
        { ...harness.criteria[1], normalized: 0.5 },
        { ...harness.criteria[2], normalized: 0.5 },
        { ...harness.criteria[3], normalized: 0.5 },
      ]);
    });
  });
  describe("getRatings", () => {
    it("should ignore unknown criterion", () => {
      harness.enter("allready");
      const criterion = { ...new FakeCriterion(), normalized: 1 };
      const result = harness.getRatings([criterion]);
      expect(result).toEqual([]);
    });
    it("should return ratings with normalized undefined when tied", () => {
      harness.enter("ratingstie");
      const result = harness.getRatings();
      expect(result).toEqual([
        { ...harness.ratings[0], normalized: 0 },
        { ...harness.ratings[1], normalized: 1 },
        { ...harness.ratings[2], normalized: 0 },
        { ...harness.ratings[3], normalized: 1 },
        { ...harness.ratings[4], normalized: 0 },
        { ...harness.ratings[5], normalized: 1 },
        { ...harness.ratings[6], normalized: undefined },
        { ...harness.ratings[7], normalized: undefined },
      ]);
    });
    it("should return ratings with normalized weights", () => {
      harness.enter("allready");
      const result = harness.getRatings();
      expect(result).toEqual([
        { ...harness.ratings[0], normalized: 0 },
        { ...harness.ratings[1], normalized: 1 },
        { ...harness.ratings[2], normalized: 0 },
        { ...harness.ratings[3], normalized: 1 },
        { ...harness.ratings[4], normalized: 0 },
        { ...harness.ratings[5], normalized: 1 },
        { ...harness.ratings[6], normalized: 0 },
        { ...harness.ratings[7], normalized: 1 },
      ]);
    });
  });
});
