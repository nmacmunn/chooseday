const runScript = () => jest.requireActual("../../src/util/env");

describe("env util", () => {
  describe("getEnv", () => {
    it("should return environment variables", () => {
      const result = runScript().getEnv();
      expect(result).toEqual(process.env);
    });
  });
});

export {};
