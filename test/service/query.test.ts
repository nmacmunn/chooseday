import Mocks from "../mocks";

jest.unmock("../mocks");

const mocks = Mocks(__dirname, {
  criterionCollection: ["../../src/service/firestore"],
  decisionCollection: ["../../src/service/firestore"],
  optionCollection: ["../../src/service/firestore"],
  ratingCollection: ["../../src/service/firestore"],
  query: ["@firebase/firestore"],
  where: ["@firebase/firestore"],
});

const runScript = () => jest.requireActual("../../src/service/query");

describe("query service", () => {
  beforeEach(() => jest.resetModules());
  describe("queryCollaboratorDecisions", () => {
    it("should query decisions by collaborator", () => {
      runScript().queryCollaboratorDecisions({ email: "user@example.com" });
      expect(mocks.where).toHaveBeenCalledWith(
        "collaborator",
        "array-contains",
        "user@example.com"
      );
      expect(mocks.query).toHaveBeenCalledWith(
        mocks.decisionCollection,
        mocks.where.mock.results[0].value
      );
    });
    it("should return the results", () => {
      expect(
        runScript().queryCollaboratorDecisions({ email: "user@example.com" })
      ).toEqual(mocks.query.mock.results[0].value);
    });
  });
  describe("queryCreatorDecisions", () => {
    it("should query decisions by collaborator", () => {
      runScript().queryCreatorDecisions({ id: "userId" });
      expect(mocks.where).toHaveBeenCalledWith("creator.id", "==", "userId");
      expect(mocks.query).toHaveBeenCalledWith(
        mocks.decisionCollection,
        mocks.where.mock.results[0].value
      );
    });
    it("should return the results", () => {
      expect(runScript().queryCreatorDecisions({ id: "userId" })).toEqual(
        mocks.query.mock.results[0].value
      );
    });
  });
  describe("queryCriteria", () => {
    it("should query criteria by decisionId", () => {
      runScript().queryCriteria("decisionId");
      expect(mocks.where).toHaveBeenCalledWith(
        "decisionId",
        "==",
        "decisionId"
      );
      expect(mocks.query).toHaveBeenCalledWith(
        mocks.criterionCollection,
        mocks.where.mock.results[0].value
      );
    });
    it("should return the results if user is not specified", () => {
      expect(runScript().queryCriteria("decisionId")).toEqual(
        mocks.query.mock.results[0].value
      );
    });
    it("should query the results by user id", () => {
      runScript().queryCriteria("decisionId", { id: "userId" });
      expect(mocks.where).toHaveBeenCalledWith("user.id", "==", "userId");
      expect(mocks.query).toHaveBeenCalledWith(
        mocks.query.mock.results[0].value,
        mocks.where.mock.results[1].value
      );
    });
    it("should return the results", () => {
      expect(runScript().queryCriteria("decisionId", { id: "userId" })).toEqual(
        mocks.query.mock.results[1].value
      );
    });
  });
  describe("queryOptions", () => {
    it("should query options by decisionId", () => {
      runScript().queryOptions("decisionId");
      expect(mocks.where).toHaveBeenCalledWith(
        "decisionId",
        "==",
        "decisionId"
      );
      expect(mocks.query).toHaveBeenCalledWith(
        mocks.optionCollection,
        mocks.where.mock.results[0].value
      );
    });
    it("should return the results", () => {
      expect(runScript().queryOptions("decisionId")).toEqual(
        mocks.query.mock.results[0].value
      );
    });
  });
  describe("queryRatings", () => {
    it("should query ratings by decisionId", () => {
      runScript().queryRatings("decisionId");
      expect(mocks.where).toHaveBeenCalledWith(
        "decisionId",
        "==",
        "decisionId"
      );
      expect(mocks.query).toHaveBeenCalledWith(
        mocks.ratingCollection,
        mocks.where.mock.results[0].value
      );
    });
    it("should return the results if user is not specified", () => {
      expect(runScript().queryRatings("decisionId")).toEqual(
        mocks.query.mock.results[0].value
      );
    });
    it("should query the results by user id", () => {
      runScript().queryRatings("decisionId", { id: "userId" });
      expect(mocks.where).toHaveBeenCalledWith("user.id", "==", "userId");
      expect(mocks.query).toHaveBeenCalledWith(
        mocks.query.mock.results[0].value,
        mocks.where.mock.results[1].value
      );
    });
    it("should return the results", () => {
      expect(runScript().queryRatings("decisionId", { id: "userId " })).toEqual(
        mocks.query.mock.results[1].value
      );
    });
  });
});
