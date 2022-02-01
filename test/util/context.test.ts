import { AppContext } from "../../src/types/context";
import {
  FakeCriterion,
  FakeDecision,
  FakeOption,
  FakeRating,
  FakeUser,
} from "../helpers/fake";

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
        userCriteria: [],
        userRatings: [],
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
    it("should be false if userCriteria is undefined", () => {
      context.userCriteria = undefined;
      const result = runScript().isCriteriaContext(context);
      expect(result).toBe(false);
    });
    it("should be false if userRatings is undefined", () => {
      context.userRatings = undefined;
      const result = runScript().isCriteriaContext(context);
      expect(result).toBe(false);
    });
    it("should be true", () => {
      const result = runScript().isCriteriaContext(context);
      expect(result).toBe(true);
    });
  });
  describe("isDecisionLoadedContext", () => {
    let context: AppContext;
    beforeEach(() => {
      context = {
        criteria: [],
        decision: new FakeDecision(),
        options: [],
        ratings: [],
        user: new FakeUser(),
        userCriteria: [],
        userRatings: [],
      };
    });
    it("should be false if criteria is undefined", () => {
      context.criteria = undefined;
      const result = runScript().isDecisionLoadedContext(context);
      expect(result).toBe(false);
    });
    it("should be false if decision is undefined", () => {
      context.decision = undefined;
      const result = runScript().isDecisionLoadedContext(context);
      expect(result).toBe(false);
    });
    it("should be false if options is undefined", () => {
      context.options = undefined;
      const result = runScript().isDecisionLoadedContext(context);
      expect(result).toBe(false);
    });
    it("should be false if ratings is undefined", () => {
      context.user = undefined;
      const result = runScript().isDecisionLoadedContext(context);
      expect(result).toBe(false);
    });
    it("should be false if user is undefined", () => {
      context.user = undefined;
      const result = runScript().isDecisionLoadedContext(context);
      expect(result).toBe(false);
    });
    it("should be false if userCriteria is undefined", () => {
      context.userCriteria = undefined;
      const result = runScript().isDecisionLoadedContext(context);
      expect(result).toBe(false);
    });
    it("should be false if userRatings is undefined", () => {
      context.userRatings = undefined;
      const result = runScript().isDecisionLoadedContext(context);
      expect(result).toBe(false);
    });
    it("should be true", () => {
      const result = runScript().isDecisionLoadedContext(context);
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
  describe("isDecisionsLoadedContext", () => {
    let context: AppContext;
    beforeEach(() => {
      context = {
        collaboratorDecisions: [],
        creatorDecisions: [],
        user: new FakeUser(),
      };
    });
    it("should be false if collaboratorDecisions is undefined", () => {
      context.collaboratorDecisions = undefined;
      const result = runScript().isDecisionsLoadedContext(context);
      expect(result).toBe(false);
    });
    it("should be false if creatorDecisions is undefined", () => {
      context.creatorDecisions = undefined;
      const result = runScript().isDecisionsLoadedContext(context);
      expect(result).toBe(false);
    });
    it("should be false if user is undefined", () => {
      context.user = undefined;
      const result = runScript().isDecisionsLoadedContext(context);
      expect(result).toBe(false);
    });
    it("should be true", () => {
      const result = runScript().isDecisionsLoadedContext(context);
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
    let context: AppContext;
    beforeEach(() => {
      const criteria = [new FakeCriterion(), new FakeCriterion()];
      const ratings = [
        new FakeRating(),
        new FakeRating(),
        new FakeRating(),
        new FakeRating(),
      ];
      context = {
        criteria,
        criterion: criteria[0],
        decision: new FakeDecision(),
        options: [new FakeOption(), new FakeOption()],
        ratings,
        user: new FakeUser(),
        userCriteria: criteria,
        userRatings: ratings,
      };
    });
    it("should return false if userCriteria is undefined", () => {
      context.userCriteria = undefined;
      const result = runScript().isRatingsContext(context);
      expect(result).toBe(false);
    });
    it("should return false if there are less than two userCriteria", () => {
      context.userCriteria.length = 1;
      const result = runScript().isRatingsContext(context);
      expect(result).toBe(false);
    });
    it("should return false if criterion is undefined", () => {
      context.criterion = undefined;
      const result = runScript().isRatingsContext(context);
      expect(result).toBe(false);
    });
    it("should return false if decision is undefined", () => {
      context.decision = undefined;
      const result = runScript().isRatingsContext(context);
      expect(result).toBe(false);
    });
    it("should return false if options is undefined", () => {
      context.options = undefined;
      const result = runScript().isRatingsContext(context);
      expect(result).toBe(false);
    });
    it("should return false if there are less than two options", () => {
      context.options.length = 1;
      const result = runScript().isRatingsContext(context);
      expect(result).toBe(false);
    });
    it("should return false if userRatings is undefined", () => {
      context.userRatings = undefined;
      const result = runScript().isRatingsContext(context);
      expect(result).toBe(false);
    });
    it("should return false if there are less than 4 userRatings", () => {
      context.userRatings.length = 3;
      const result = runScript().isRatingsContext(context);
      expect(result).toBe(false);
    });
    it("should return false if user is undefined", () => {
      context.user = undefined;
      const result = runScript().isRatingsContext(context);
      expect(result).toBe(false);
    });
    it("should return true", () => {
      const result = runScript().isRatingsContext(context);
      expect(result).toBe(true);
    });
  });
});

export {};
