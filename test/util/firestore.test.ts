const runScript = () => jest.requireActual("../../src/util/firestore");

describe("firestore util", () => {
  beforeEach(() => jest.resetModules());
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
