describe("types", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe("context", () => {
    it("should not export anything", () => {
      const exports = jest.requireActual("../src/types/context");
      expect(exports).toEqual({});
    });
  });
  describe("data", () => {
    it("should not export anything", () => {
      const exports = jest.requireActual("../src/types/data");
      expect(exports).toEqual({});
    });
  });
  describe("events", () => {
    it("should not export anything", () => {
      const exports = jest.requireActual("../src/types/events");
      expect(exports).toEqual({});
    });
  });
  describe("state", () => {
    it("should not export anything", () => {
      const exports = jest.requireActual("../src/types/state");
      expect(exports).toEqual({});
    });
  });
});

export {};
