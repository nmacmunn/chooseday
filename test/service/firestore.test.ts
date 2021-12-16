import Mocks from "../mocks";

jest.unmock("../mocks");

const mocks = Mocks(__dirname, {
  app: ["../../src/service/firebase"],
  collection: ["@firebase/firestore"],
  getFirestore: ["@firebase/firestore"],
});

const runScript = () => jest.requireActual("../../src/service/firestore");

describe("firestore service", () => {
  beforeEach(() => jest.resetModules());
  describe("firestore", () => {
    it("should invoke getFirestore with app", () => {
      runScript();
      expect(mocks.getFirestore.mock.calls[0]).toEqual([mocks.app]);
    });
    it("should export the result of getFirestore", () => {
      expect(runScript().firestore).toEqual(
        mocks.getFirestore.mock.results[0].value
      );
    });
  });
  describe("criterionCollection", () => {
    it("should invoke collection with firestore and 'criteria'", () => {
      const firestore = {};
      mocks.getFirestore.mockReturnValue(firestore);
      runScript();
      expect(mocks.collection.mock.calls[0]).toEqual([firestore, "criteria"]);
    });
    it("should export the collection", () => {
      expect(runScript().criterionCollection).toEqual(
        mocks.collection.mock.results[0].value
      );
    });
  });
  describe("decisionCollection", () => {
    it("should invoke collection with firestore and 'decisions'", () => {
      const firestore = {};
      mocks.getFirestore.mockReturnValue(firestore);
      runScript();
      expect(mocks.collection.mock.calls[1]).toEqual([firestore, "decisions"]);
    });
    it("should export the collection", () => {
      expect(runScript().decisionCollection).toEqual(
        mocks.collection.mock.results[1].value
      );
    });
  });
  describe("optionCollection", () => {
    it("should invoke collection with firestore and 'options'", () => {
      const firestore = {};
      mocks.getFirestore.mockReturnValue(firestore);
      runScript();
      expect(mocks.collection.mock.calls[2]).toEqual([firestore, "options"]);
    });
    it("should export the collection", () => {
      expect(runScript().optionCollection).toEqual(
        mocks.collection.mock.results[2].value
      );
    });
  });
  describe("ratingCollection", () => {
    it("should invoke collection with firestore and 'ratings'", () => {
      const firestore = {};
      mocks.getFirestore.mockReturnValue(firestore);
      runScript();
      expect(mocks.collection.mock.calls[3]).toEqual([firestore, "ratings"]);
    });
    it("should export the collection", () => {
      expect(runScript().ratingCollection).toEqual(
        mocks.collection.mock.results[3].value
      );
    });
  });

  describe("mergeId", () => {
    it("should return a document data with its id", () => {
      const doc = {
        id: "docId",
        data: () => ({
          foo: "foo",
          bar: "bar",
        }),
      };
      expect(runScript().mergeId(doc)).toEqual({
        id: "docId",
        foo: "foo",
        bar: "bar",
      });
    });
  });
});

export {};
