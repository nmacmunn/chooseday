const runScript = () => jest.requireActual("../../src/util/user");

describe("user util", () => {
  describe("hasEmail", () => {
    it("should return true if email is a string", () => {
      const result = runScript().hasEmail({
        id: "userId",
        email: "user@example.com",
      });
      expect(result).toBe(true);
    });
    it("should return false if email is undefined", () => {
      const result = runScript().hasEmail({
        id: "userId",
      });
      expect(result).toBe(false);
    });
  });
});

export {};
