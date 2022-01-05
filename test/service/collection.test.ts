const Firebase = () => jest.requireMock("../../src/service/firebase");
const Firestore = () => jest.requireMock("@firebase/firestore");

const runScript = () => jest.requireActual("../../src/service/collection");

describe("collection service", () => {
  beforeEach(() => jest.resetModules());
  describe("firestore", () => {
    it("should invoke getFirestore with app", () => {
      runScript();
      expect(Firestore().getFirestore).toHaveBeenCalledWith(Firebase().app);
    });
    it("should export the result of getFirestore", () => {
      expect(runScript().firestore).toBe(
        Firestore().getFirestore.mock.results[0].value
      );
    });
  });
  describe("criterionCollection", () => {
    it("should invoke collection with firestore and 'criteria'", () => {
      Firestore().getFirestore.mockReturnValue({});
      runScript();
      expect(Firestore().collection).toHaveBeenNthCalledWith(1, {}, "criteria");
    });
    it("should export the collection", () => {
      expect(runScript().criterionCollection).toBe(
        Firestore().collection.mock.results[0].value
      );
    });
  });
  describe("decisionCollection", () => {
    it("should invoke collection with firestore and 'decisions'", () => {
      Firestore().getFirestore.mockReturnValue({});
      runScript();
      expect(Firestore().collection).toHaveBeenNthCalledWith(
        2,
        {},
        "decisions"
      );
    });
    it("should export the collection", () => {
      expect(runScript().decisionCollection).toBe(
        Firestore().collection.mock.results[1].value
      );
    });
  });
  describe("optionCollection", () => {
    it("should invoke collection with firestore and 'options'", () => {
      Firestore().getFirestore.mockReturnValue({});
      runScript();
      expect(Firestore().collection).toHaveBeenNthCalledWith(3, {}, "options");
    });
    it("should export the collection", () => {
      expect(runScript().optionCollection).toBe(
        Firestore().collection.mock.results[2].value
      );
    });
  });
  describe("ratingCollection", () => {
    it("should invoke collection with firestore and 'ratings'", () => {
      Firestore().getFirestore.mockReturnValue({});
      runScript();
      expect(Firestore().collection).toHaveBeenNthCalledWith(4, {}, "ratings");
    });
    it("should export the collection", () => {
      expect(runScript().ratingCollection).toBe(
        Firestore().collection.mock.results[3].value
      );
    });
  });
});

export {};
