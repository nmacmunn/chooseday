import {
  FakeCriterion,
  FakeRating,
  FakeRatingsContext,
  FakeUser,
} from "../fake";
import _ from "lodash";

jest.unmock("../fake");
jest.unmock("lodash");

jest.unmock("../../src/util/context");
jest.unmock("../../src/util/results");

const runScript = () => jest.requireActual("../../src/util/guard");

describe("guard util", () => {
  describe("doneRatingCurrent", () => {
    it("should return false if context is not RatingsContext", () => {
      const result = runScript().doneRatingCurrent({});
      expect(result).toBe(false);
    });
    it("should return false if all ratings have the same weight", () => {
      const context = new FakeRatingsContext();
      const weight = 1;
      context.ratings.length = 0;
      for (const { id: optionId } of context.options) {
        for (const { id: criterionId } of context.criteria) {
          context.ratings.push(
            new FakeRating({ criterionId, optionId, weight })
          );
        }
      }
      const result = runScript().doneRatingCurrent(context);
      expect(result).toBe(false);
    });
    it("should return true if ratings have different weights", () => {
      const context = new FakeRatingsContext();
      const result = runScript().doneRatingCurrent(context);
      expect(result).toBe(true);
    });
  });
  describe("doneRating", () => {
    it("should return false if context is not RatingsContext", () => {
      const result = runScript().doneRating({});
      expect(result).toBe(false);
    });
    it("should return false if users ratings have the same weight", () => {
      const context = new FakeRatingsContext();
      const weight = 1;
      context.ratings.length = 0;
      for (const { id: optionId } of context.options) {
        for (const { id: criterionId } of context.criteria) {
          context.ratings.push(
            new FakeRating({ criterionId, optionId, weight })
          );
        }
      }
      const result = runScript().doneRating(context);
      expect(result).toBe(false);
    });
    it("should return true if user's ratings have different weights", () => {
      const context = new FakeRatingsContext();
      // add another user's ratings with ties
      const user = new FakeUser({ id: "other" });
      const criteria = [
        new FakeCriterion({ id: "other1", user }),
        new FakeCriterion({ id: "other2", user }),
      ];
      context.criteria.push(...criteria);
      const weight = 1;
      for (const { id: optionId } of context.options) {
        for (const { id: criterionId } of criteria) {
          context.ratings.push(
            new FakeRating({ criterionId, optionId, user, weight })
          );
        }
      }
      const result = runScript().doneRating(context);
      expect(result).toBe(true);
    });
  });
  describe("enoughCriteria", () => {
    it("should return false if user is undefined", () => {
      const result = runScript().enoughCriteria({});
      expect(result).toBe(false);
    });
    it("should return false if criteria is undefined", () => {
      const result = runScript().enoughCriteria({ user: {} });
      expect(result).toBe(false);
    });
    it("should return false if there are less than two criteria belonging to the user", () => {
      const result = runScript().enoughCriteria({ user: {}, criteria: [] });
      expect(result).toBe(false);
    });
    it("should return true if there are two criteria belonging to the user", () => {
      const result = runScript().enoughCriteria({
        user: new FakeUser(),
        criteria: [new FakeCriterion(), new FakeCriterion()],
      });
      expect(result).toBe(true);
    });
  });
  describe("enterError", () => {
    it("should return false if not an error context", () => {
      const result = runScript().enterError({}, {}, {} as any);
      expect(result).toBe(false);
    });
    it("should return false is state is already 'error'", () => {
      const matches = jest.fn(() => true);
      const result = runScript().enterError(
        {
          error: "error",
        },
        {},
        { state: { matches } } as any
      );
      expect(result).toBe(false);
    });
    it("should return true if context is an error context and state is not 'error'", () => {
      const matches = jest.fn(() => false);
      const result = runScript().enterError(
        {
          error: "error",
        },
        {},
        { state: { matches } } as any
      );
      expect(result).toBe(true);
    });
  });
});
