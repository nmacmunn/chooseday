import { AppContext } from "../../src/types/context";
import { FakeDecision, FakeOption, FakeUser } from "../helpers/fake";

jest.unmock("../helpers/fake");

const runScript = () => jest.requireActual("../../src/util/context");

describe("context util", () => {
  beforeEach(() => jest.resetModules());
  describe("isCriteriaContext", () => {
    let context: AppContext;
    beforeEach(() => {
      context = {
        criteria: [],
        decision: new FakeDecision(),
        options: [new FakeOption(), new FakeOption()],
        ratings: [],
        user: new FakeUser(),
      };
    });
    it("should be false if criteria is undefined", () => {
      context.criteria = undefined;
      const result = runScript().isCriteriaContext(context);
      expect(result).toBe(false);
    });
    it("should be false if decision is undefined", () => {
      context.decision = undefined;
      const result = runScript().isCriteriaContext(context);
      expect(result).toBe(false);
    });
    it("should be false if options is undefined", () => {
      context.options = undefined;
      const result = runScript().isCriteriaContext(context);
      expect(result).toBe(false);
    });
    it("should be false if there are fewer than two options", () => {
      context.options.length = 1;
      const result = runScript().isCriteriaContext(context);
      expect(result).toBe(false);
    });
    it("should be false if ratings is undefined", () => {
      context.user = undefined;
      const result = runScript().isCriteriaContext(context);
      expect(result).toBe(false);
    });
    it("should be false if user is undefined", () => {
      context.user = undefined;
      const result = runScript().isCriteriaContext(context);
      expect(result).toBe(false);
    });
    it("should be true", () => {
      const result = runScript().isCriteriaContext(context);
      expect(result).toBe(true);
    });
  });
  describe("isDecisionLoadingContext", () => {
    it("should be false if decision is undefined", () => {
      const result = runScript().isDecisionLoadingContext({
        user: {},
      });
      expect(result).toBe(false);
    });
    it("should be false if user is undefined", () => {
      const result = runScript().isDecisionLoadingContext({
        decision: {},
      });
      expect(result).toBe(false);
    });
    it("should be true", () => {
      const result = runScript().isDecisionLoadingContext({
        decision: {},
        user: {},
      });
      expect(result).toBe(true);
    });
  });
  describe("isDecisionsLoadingContext", () => {
    it("should be false if user is undefined", () => {
      const result = runScript().isDecisionsLoadingContext({});
      expect(result).toBe(false);
    });
    it("should be true", () => {
      const result = runScript().isDecisionsLoadingContext({
        user: {},
      });
      expect(result).toBe(true);
    });
  });
  describe("isErrorContext", () => {
    it("should be false if error is undefined", () => {
      const result = runScript().isErrorContext({});
      expect(result).toBe(false);
    });
    it("should be true if error is defined", () => {
      const result = runScript().isErrorContext({ error: "error" });
      expect(result).toBe(true);
    });
  });
  describe("isRatingsContext", () => {
    it("should return false if criteria is undefined", () => {
      const result = runScript().isRatingsContext({});
      expect(result).toBe(false);
    });
    it("should return false if there are less than two criteria", () => {
      const result = runScript().isRatingsContext({ criteria: [] });
      expect(result).toBe(false);
    });
    it("should return false if criterion is undefined", () => {
      const result = runScript().isRatingsContext({ criteria: [{}, {}] });
      expect(result).toBe(false);
    });
    it("should return false if decision is undefined", () => {
      const result = runScript().isRatingsContext({
        criteria: [{}, {}],
        criterion: {},
      });
      expect(result).toBe(false);
    });
    it("should return false if options is undefined", () => {
      const result = runScript().isRatingsContext({
        criteria: [{}, {}],
        criterion: {},
        decision: {},
      });
      expect(result).toBe(false);
    });
    it("should return false if there are less than two options", () => {
      const result = runScript().isRatingsContext({
        criteria: [{}, {}],
        criterion: {},
        decision: {},
        options: [],
      });
      expect(result).toBe(false);
    });
    it("should return false if ratings is undefined", () => {
      const result = runScript().isRatingsContext({
        criteria: [{}, {}],
        criterion: {},
        decision: {},
        options: [{}, {}],
      });
      expect(result).toBe(false);
    });
    it("should return false if there are less than 4 ratings", () => {
      const result = runScript().isRatingsContext({
        criteria: [{}, {}],
        criterion: {},
        decision: {},
        options: [{}, {}],
        ratings: [],
      });
      expect(result).toBe(false);
    });
    it("should return false if user is undefined", () => {
      const result = runScript().isRatingsContext({
        criteria: [{}, {}],
        criterion: {},
        decision: {},
        options: [{}, {}],
        ratings: [{}, {}, {}, {}],
      });
      expect(result).toBe(false);
    });
    it("should return true", () => {
      const result = runScript().isRatingsContext({
        criteria: [{}, {}],
        criterion: {},
        decision: {},
        options: [{}, {}],
        ratings: [{}, {}, {}, {}],
        user: {},
      });
      expect(result).toBe(true);
    });
  });
});

export {};
