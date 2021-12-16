const runScript = () => jest.requireActual("../../src/util/context");

describe("context util", () => {
  beforeEach(() => jest.resetModules());
  describe("isSignedinContext", () => {
    it("should be false if user is undefined", () => {
      const result = runScript().isSignedinContext({});
      expect(result).toBe(false);
    });
    it("should be true", () => {
      const result = runScript().isSignedinContext({
        user: {},
      });
      expect(result).toBe(true);
    });
  });
  describe("isDecisionContext", () => {
    it("should be false if decision is undefined", () => {
      const result = runScript().isDecisionContext({
        user: {},
      });
      expect(result).toBe(false);
    });
    it("should be false if user is undefined", () => {
      const result = runScript().isDecisionContext({
        decision: {},
      });
      expect(result).toBe(false);
    });
    it("should be true", () => {
      const result = runScript().isDecisionContext({
        decision: {},
        user: {},
      });
      expect(result).toBe(true);
    });
  });
  describe("isCriteriaContext", () => {
    it("should be false if decision is undefined", () => {
      const result = runScript().isCriteriaContext({});
      expect(result).toBe(false);
    });
    it("should be false if options is undefined", () => {
      const result = runScript().isCriteriaContext({ decision: {} });
      expect(result).toBe(false);
    });
    it("should be false if there are fewer than two options", () => {
      const result = runScript().isCriteriaContext({
        decision: {},
        options: [],
      });
      expect(result).toBe(false);
    });
    it("should be false if user is undefined", () => {
      const result = runScript().isCriteriaContext({
        decision: {},
        options: [{}, {}],
      });
      expect(result).toBe(false);
    });
    it("should be true", () => {
      const result = runScript().isCriteriaContext({
        decision: {},
        options: [{}, {}],
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
