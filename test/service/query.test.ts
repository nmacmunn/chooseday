const Firestore = () => jest.requireMock("@firebase/firestore");
const Collection = () => jest.requireMock("../../src/service/collection");

const runScript = () => jest.requireActual("../../src/service/query");

describe("query service", () => {
  beforeEach(() => jest.resetModules());
  describe("queryCollaboratorDecisions", () => {
    it("should query decisions by collaborator", () => {
      runScript().queryCollaboratorDecisions({ email: "user@example.com" });
      expect(Firestore().where).toHaveBeenCalledWith(
        "collaborators",
        "array-contains",
        "user@example.com"
      );
      expect(Firestore().query).toHaveBeenCalledWith(
        Collection().decisionCollection,
        Firestore().where.mock.results[0].value
      );
    });
    it("should return the results", () => {
      expect(
        runScript().queryCollaboratorDecisions({ email: "user@example.com" })
      ).toEqual(Firestore().query.mock.results[0].value);
    });
  });
  describe("queryCreatorDecisions", () => {
    it("should query decisions by collaborator", () => {
      runScript().queryCreatorDecisions({ id: "userId" });
      expect(Firestore().where).toHaveBeenCalledWith(
        "creator.id",
        "==",
        "userId"
      );
      expect(Firestore().query).toHaveBeenCalledWith(
        Collection().decisionCollection,
        Firestore().where.mock.results[0].value
      );
    });
    it("should return the results", () => {
      expect(runScript().queryCreatorDecisions({ id: "userId" })).toEqual(
        Firestore().query.mock.results[0].value
      );
    });
  });
  describe("queryCriteria", () => {
    it("should query criteria by decisionId", () => {
      runScript().queryCriteria("decisionId");
      expect(Firestore().where).toHaveBeenCalledWith(
        "decisionId",
        "==",
        "decisionId"
      );
      expect(Firestore().query).toHaveBeenCalledWith(
        Collection().criterionCollection,
        Firestore().where.mock.results[0].value
      );
    });
    it("should return the results if user is not specified", () => {
      expect(runScript().queryCriteria("decisionId")).toEqual(
        Firestore().query.mock.results[0].value
      );
    });
    it("should query the results by user id", () => {
      runScript().queryCriteria("decisionId", { id: "userId" });
      expect(Firestore().where).toHaveBeenCalledWith("user.id", "==", "userId");
      expect(Firestore().query).toHaveBeenCalledWith(
        Firestore().query.mock.results[0].value,
        Firestore().where.mock.results[1].value
      );
    });
    it("should return the results", () => {
      expect(runScript().queryCriteria("decisionId", { id: "userId" })).toEqual(
        Firestore().query.mock.results[1].value
      );
    });
  });
  describe("queryOptions", () => {
    it("should query options by decisionId", () => {
      runScript().queryOptions("decisionId");
      expect(Firestore().where).toHaveBeenCalledWith(
        "decisionId",
        "==",
        "decisionId"
      );
      expect(Firestore().query).toHaveBeenCalledWith(
        Collection().optionCollection,
        Firestore().where.mock.results[0].value
      );
    });
    it("should return the results", () => {
      expect(runScript().queryOptions("decisionId")).toEqual(
        Firestore().query.mock.results[0].value
      );
    });
  });
  describe("queryRatings", () => {
    it("should query ratings by decisionId", () => {
      runScript().queryRatings("decisionId");
      expect(Firestore().where).toHaveBeenCalledWith(
        "decisionId",
        "==",
        "decisionId"
      );
      expect(Firestore().query).toHaveBeenCalledWith(
        Collection().ratingCollection,
        Firestore().where.mock.results[0].value
      );
    });
    it("should return the results if user is not specified", () => {
      expect(runScript().queryRatings("decisionId")).toEqual(
        Firestore().query.mock.results[0].value
      );
    });
    it("should query the results by user id", () => {
      runScript().queryRatings("decisionId", { id: "userId" });
      expect(Firestore().where).toHaveBeenCalledWith("user.id", "==", "userId");
      expect(Firestore().query).toHaveBeenCalledWith(
        Firestore().query.mock.results[0].value,
        Firestore().where.mock.results[1].value
      );
    });
    it("should return the results", () => {
      expect(runScript().queryRatings("decisionId", { id: "userId " })).toEqual(
        Firestore().query.mock.results[1].value
      );
    });
  });
});

export {};
