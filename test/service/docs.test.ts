import Mocks from "../mocks";

jest.unmock("../mocks");

const runScript = () => jest.requireActual("../../src/service/docs");

const mocks = Mocks(__dirname, {
  criterionCollection: ["../../src/service/firestore"],
  decisionCollection: ["../../src/service/firestore"],
  doc: ["@firebase/firestore"],
  getDocs: ["@firebase/firestore"],
  optionCollection: ["../../src/service/firestore"],
  queryCriteria: ["../../src/service/query"],
  queryOptions: ["../../src/service/query"],
  queryRatings: ["../../src/service/query"],
  ratingCollection: ["../../src/service/firestore"],
});

describe("docs service", () => {
  describe("criterionRef", () => {
    it("should return a criterion collection doc reference", () => {
      const result = runScript().criterionRef("id");
      expect(mocks.doc).toHaveBeenLastCalledWith(
        mocks.criterionCollection,
        "id"
      );
      expect(result).toBe(mocks.doc.mock.results[0].value);
    });
  });
  describe("decisionRef", () => {
    it("should return a decision collection doc reference", () => {
      const result = runScript().decisionRef("id");
      expect(mocks.doc).toHaveBeenLastCalledWith(
        mocks.decisionCollection,
        "id"
      );
      expect(result).toBe(mocks.doc.mock.results[0].value);
    });
  });
  describe("optionRef", () => {
    it("should return a option collection doc reference", () => {
      const result = runScript().optionRef("id");
      expect(mocks.doc).toHaveBeenLastCalledWith(mocks.optionCollection, "id");
      expect(result).toBe(mocks.doc.mock.results[0].value);
    });
  });
  describe("ratingRef", () => {
    it("should return a rating collection doc reference", () => {
      const result = runScript().ratingRef("id");
      expect(mocks.doc).toHaveBeenLastCalledWith(mocks.ratingCollection, "id");
      expect(result).toBe(mocks.doc.mock.results[0].value);
    });
  });
  describe("getCriteria", () => {
    it("should query criteria", () => {
      runScript().getCriteria("decisionId", { id: "userId" });
      expect(mocks.queryCriteria.mock.calls[0]).toEqual([
        "decisionId",
        { id: "userId" },
      ]);
    });
    it("should get docs with query", () => {
      runScript().getCriteria("decisionId", { id: "userId" });
      expect(mocks.getDocs).toHaveBeenCalledWith(
        mocks.queryCriteria.mock.results[0].value
      );
    });
    it("should return result of getDocs", () => {
      const result = runScript().getCriteria("decisionId", { id: "userId" });
      expect(result).toEqual(mocks.getDocs.mock.results[0].value);
    });
  });

  describe("getOptions", () => {
    it("should query options", () => {
      runScript().getOptions("decisionId");
      expect(mocks.queryOptions.mock.calls[0]).toEqual(["decisionId"]);
    });
    it("should get docs with query", () => {
      runScript().getOptions("decisionId");
      expect(mocks.getDocs).toHaveBeenCalledWith(
        mocks.queryOptions.mock.results[0].value
      );
    });
    it("should return result of getDocs", () => {
      const result = runScript().getOptions("decisionId");
      expect(result).toEqual(mocks.getDocs.mock.results[0].value);
    });
  });

  describe("getRatings", () => {
    it("should query ratings", () => {
      runScript().getRatings("decisionId", { id: "userId" });
      expect(mocks.queryRatings.mock.calls[0]).toEqual([
        "decisionId",
        { id: "userId" },
      ]);
    });
    it("should get docs with query", () => {
      runScript().getRatings("decisionId", { id: "userId" });
      expect(mocks.getDocs).toHaveBeenCalledWith(
        mocks.queryRatings.mock.results[0].value
      );
    });
    it("should return result of getDocs", () => {
      const result = runScript().getRatings("decisionId", { id: "userId" });
      expect(result).toEqual(mocks.getDocs.mock.results[0].value);
    });
  });
});
