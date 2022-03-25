import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();

const runScript = () => jest.requireActual("../../src/util/guard");

describe("guard util", () => {
  describe("doneRatingCurrent", () => {
    it("should return false if context is not RatingsContext", () => {
      const harness = new MachineHarness();
      harness.enter("criteria");
      const result = runScript().doneRatingCurrent(harness.state.context);
      expect(result).toBe(false);
    });
    it("should return false if all ratings have the same weight", () => {
      const harness = new MachineHarness();
      harness.enter("ratings");
      const result = runScript().doneRatingCurrent(harness.state.context);
      expect(result).toBe(false);
    });
    it("should return true if ratings have different weights", () => {
      const harness = new MachineHarness();
      harness.enter("collaborators");
      const result = runScript().doneRatingCurrent(harness.state.context);
      expect(result).toBe(true);
    });
  });
  describe("doneRating", () => {
    it("should return false if context is not RatingsContext", () => {
      const harness = new MachineHarness();
      harness.enter("criteria");
      const result = runScript().doneRating(harness.state.context);
      expect(result).toBe(false);
    });
    it("should return false if user's ratings have the same weight", () => {
      const harness = new MachineHarness();
      harness.enter("ratings");
      const result = runScript().doneRating(harness.state.context);
      expect(result).toBe(false);
    });
    it("should return true if user's ratings have different weights", () => {
      const harness = new MachineHarness();
      harness.enter("collaborators");
      const result = runScript().doneRating(harness.state.context);
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
  describe("noError", () => {
    it("should return false if error is defined", () => {
      const result = runScript().noError({ error: {} });
      expect(result).toBe(false);
    });
    it("should return true if error is undefined", () => {
      const result = runScript().noError({ error: undefined });
      expect(result).toBe(true);
    });
  });
});
