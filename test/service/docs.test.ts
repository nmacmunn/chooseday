const Collection = () => jest.requireMock("../../src/service/collection");
const Firebase = () => jest.requireMock("@firebase/firestore");
const Query = () => jest.requireMock("../../src/service/query");

const runScript = () => jest.requireActual("../../src/service/docs");

describe("docs service", () => {
  beforeEach(() => jest.resetModules());
  describe("criterionRef", () => {
    it("should return a criterion collection doc reference", () => {
      const result = runScript().criterionRef("id");
      expect(Firebase().doc).toHaveBeenLastCalledWith(
        Collection().criterionCollection,
        "id"
      );
      expect(result).toBe(Firebase().doc.mock.results[0].value);
    });
  });
  describe("decisionRef", () => {
    it("should return a decision collection doc reference", () => {
      const result = runScript().decisionRef("id");
      expect(Firebase().doc).toHaveBeenLastCalledWith(
        Collection().decisionCollection,
        "id"
      );
      expect(result).toBe(Firebase().doc.mock.results[0].value);
    });
  });
  describe("optionRef", () => {
    it("should return a option collection doc reference", () => {
      const result = runScript().optionRef("id");
      expect(Firebase().doc).toHaveBeenLastCalledWith(
        Collection().optionCollection,
        "id"
      );
      expect(result).toBe(Firebase().doc.mock.results[0].value);
    });
  });
  describe("ratingRef", () => {
    it("should return a rating collection doc reference", () => {
      const result = runScript().ratingRef("id");
      expect(Firebase().doc).toHaveBeenLastCalledWith(
        Collection().ratingCollection,
        "id"
      );
      expect(result).toBe(Firebase().doc.mock.results[0].value);
    });
  });
  describe("getCriteria", () => {
    it("should query criteria", () => {
      runScript().getCriteria("decisionId", { id: "userId" });
      expect(Query().queryCriteria.mock.calls[0]).toEqual([
        "decisionId",
        { id: "userId" },
      ]);
    });
    it("should get docs with query", () => {
      runScript().getCriteria("decisionId", { id: "userId" });
      expect(Firebase().getDocs).toHaveBeenCalledWith(
        Query().queryCriteria.mock.results[0].value
      );
    });
    it("should return result of getDocs", () => {
      const result = runScript().getCriteria("decisionId", { id: "userId" });
      expect(result).toEqual(Firebase().getDocs.mock.results[0].value);
    });
  });

  describe("getOptions", () => {
    it("should query options", () => {
      runScript().getOptions("decisionId");
      expect(Query().queryOptions.mock.calls[0]).toEqual(["decisionId"]);
    });
    it("should get docs with query", () => {
      runScript().getOptions("decisionId");
      expect(Firebase().getDocs).toHaveBeenCalledWith(
        Query().queryOptions.mock.results[0].value
      );
    });
    it("should return result of getDocs", () => {
      const result = runScript().getOptions("decisionId");
      expect(result).toEqual(Firebase().getDocs.mock.results[0].value);
    });
  });

  describe("getRatings", () => {
    it("should query ratings", () => {
      runScript().getRatings("decisionId", { id: "userId" });
      expect(Query().queryRatings.mock.calls[0]).toEqual([
        "decisionId",
        { id: "userId" },
      ]);
    });
    it("should get docs with query", () => {
      runScript().getRatings("decisionId", { id: "userId" });
      expect(Firebase().getDocs).toHaveBeenCalledWith(
        Query().queryRatings.mock.results[0].value
      );
    });
    it("should return result of getDocs", () => {
      const result = runScript().getRatings("decisionId", { id: "userId" });
      expect(result).toEqual(Firebase().getDocs.mock.results[0].value);
    });
  });
});
