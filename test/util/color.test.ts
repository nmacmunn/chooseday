const Color = () => jest.requireActual("../../src/util/color");
const D3 = () => jest.requireMock("d3-scale-chromatic");

describe("color util", () => {
  beforeEach(() => jest.resetModules());
  describe("getCool", () => {
    it("should invoke interpolateCool", () => {
      D3().interpolateCool.mockReturnValue("blue");
      const result = Color().getCool(0, 1);
      expect(result).toBe("blue");
      expect(D3().interpolateCool).toHaveBeenCalledWith(0.5);
    });
  });
  describe("getWarm", () => {
    it("should invoke interpolateWarm", () => {
      D3().interpolateWarm.mockReturnValue("red");
      const result = Color().getWarm(0, 1);
      expect(result).toBe("red");
      expect(D3().interpolateWarm).toHaveBeenCalledWith(0.5);
    });
  });
});
