import {
  FakeCriterion,
  FakeDecision,
  FakeOption,
  FakeRating,
  FakeTransaction,
  FakeUser,
} from "../fake";
import Mocks from "../mocks";

jest.unmock("../fake");
jest.unmock("../mocks");

const runScript = () => jest.requireActual("../../src/service/db");

const mocks = Mocks(__dirname, {
  addDoc: ["@firebase/firestore"],
  criterionCollection: ["../../src/service/firestore"],
  criterionRef: ["../../src/service/docs"],
  decisionCollection: ["../../src/service/firestore"],
  decisionRef: ["../../src/service/docs"],
  firestore: ["../../src/service/firestore"],
  getCriteria: ["../../src/service/docs"],
  getOptions: ["../../src/service/docs"],
  getRatings: ["../../src/service/docs"],
  increment: ["@firebase/firestore"],
  mergeId: ["../../src/service/firestore"],
  onSnapshot: ["@firebase/firestore"],
  optionRef: ["../../src/service/docs"],
  queryCollaboratorDecisions: ["../../src/service/query"],
  queryCreatorDecisions: ["../../src/service/query"],
  queryCriteria: ["../../src/service/query"],
  queryOptions: ["../../src/service/query"],
  queryRatings: ["../../src/service/query"],
  ratingRef: ["../../src/service/docs"],
  runTransaction: ["@firebase/firestore"],
  updateDoc: ["@firebase/firestore"],
});

describe("db service", () => {
  beforeEach(() => jest.resetModules());
  describe("addCriterion", () => {
    it("should get options", async () => {
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      expect(mocks.getOptions).toHaveBeenCalledWith("decisionId");
    });
    it("should get criteria", async () => {
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      expect(mocks.getCriteria).toHaveBeenCalledWith("decisionId", {
        id: "userId",
      });
    });
    it("should run a transaction", async () => {
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      const { firestore } = jest.requireMock("../../src/service/firestore");
      expect(mocks.runTransaction.mock.calls[0][0]).toEqual(firestore);
      expect(mocks.runTransaction.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should increment each criteria weight", async () => {
      mocks.getCriteria.mockReturnValue([{ ref: "ref1" }, { ref: "ref2" }]);
      mocks.getOptions.mockReturnValue([]);
      mocks.increment.mockReturnValueOnce(1).mockReturnValueOnce(2);
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.update).toHaveBeenCalledWith("ref1", { weight: 1 });
      expect(transaction.update).toHaveBeenCalledWith("ref2", { weight: 2 });
    });
    it("should create a new criterion", async () => {
      mocks.getCriteria.mockReturnValue([]);
      mocks.getOptions.mockReturnValue([]);
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(mocks.criterionRef).toHaveBeenCalled();
      expect(transaction.set).toHaveBeenCalledWith(
        mocks.criterionRef.mock.results[0].value,
        {
          decisionId: "decisionId",
          title: "criteria",
          user: {
            id: "userId",
          },
          weight: 1,
        }
      );
    });
    it("should add a new rating for each option", async () => {
      mocks.getCriteria.mockReturnValue([]);
      mocks.getOptions.mockReturnValue([{ id: "option1" }, { id: "option2" }]);
      mocks.criterionRef.mockReturnValue({ id: "criterionId" });
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(mocks.ratingRef).toHaveBeenCalledTimes(2);
      expect(transaction.set).toHaveBeenCalledWith(
        mocks.ratingRef.mock.results[0].value,
        {
          criterionId: "criterionId",
          decisionId: "decisionId",
          optionId: "option1",
          user: {
            id: "userId",
          },
          weight: 1,
        }
      );
      expect(transaction.set).toHaveBeenCalledWith(
        mocks.ratingRef.mock.results[1].value,
        {
          criterionId: "criterionId",
          decisionId: "decisionId",
          optionId: "option2",
          user: {
            id: "userId",
          },
          weight: 1,
        }
      );
    });
  });
  describe("addDecision", () => {
    it("should add a document to decisionCollection", async () => {
      jest.spyOn(Date, "now").mockReturnValue(1234567890);
      await runScript().addDecision({ id: "userId" }, "decision");
      expect(mocks.addDoc).toHaveBeenCalledWith(mocks.decisionCollection, {
        collaborators: [],
        created: 1234567890,
        creator: { id: "userId" },
        title: "decision",
      });
    });
    it("should return the document id", async () => {
      mocks.addDoc.mockReturnValue({ id: "decisionId" });
      const result = await runScript().addDecision(
        { id: "userId" },
        "decision"
      );
      expect(result).toEqual("decisionId");
    });
  });
  describe("addOption", () => {
    it("should get criteria", async () => {
      await runScript().addOption("decisionId", "option");
      expect(mocks.getCriteria).toHaveBeenCalledWith("decisionId");
    });
    it("should run a transaction", async () => {
      await runScript().addOption("decisionId", "option");
      const { firestore } = jest.requireMock("../../src/service/firestore");
      expect(mocks.runTransaction.mock.calls[0][0]).toEqual(firestore);
      expect(mocks.runTransaction.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should create a new option", async () => {
      jest.spyOn(Date, "now").mockReturnValue(1234567890);
      mocks.getCriteria.mockReturnValue([]);
      await runScript().addOption("decisionId", "option");
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(mocks.optionRef).toHaveBeenCalled();
      expect(transaction.set).toHaveBeenCalledWith(
        mocks.optionRef.mock.results[0].value,
        {
          created: 1234567890,
          decisionId: "decisionId",
          title: "option",
        }
      );
    });
    it("should add a new rating for each criterion", async () => {
      mocks.getCriteria.mockReturnValue([
        {
          id: "criterion1",
          get: () => ({ id: "user1" }),
        },
        {
          id: "criterion2",
          get: () => ({ id: "user2" }),
        },
      ]);
      mocks.optionRef.mockReturnValue({ id: "option1" });
      await runScript().addOption("decisionId", "option");
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.set).toHaveBeenCalledWith(
        mocks.ratingRef.mock.results[0].value,
        {
          criterionId: "criterion1",
          decisionId: "decisionId",
          optionId: "option1",
          user: { id: "user1" },
          weight: 1,
        }
      );
      expect(transaction.set).toHaveBeenCalledWith(
        mocks.ratingRef.mock.results[1].value,
        {
          criterionId: "criterion2",
          decisionId: "decisionId",
          optionId: "option1",
          user: { id: "user2" },
          weight: 1,
        }
      );
    });
  });
  describe("removeCriterion", () => {
    it("should get criteria", async () => {
      const criterion = new FakeCriterion();
      await runScript().removeCriterion(criterion);
      expect(mocks.getCriteria).toHaveBeenCalledWith("decisionId", {
        id: "userId",
      });
    });
    it("should get ratings", async () => {
      const criterion = new FakeCriterion();
      await runScript().removeCriterion(criterion);
      expect(mocks.getRatings).toHaveBeenCalledWith("decisionId", {
        id: "userId",
      });
    });
    it("should run a transaction", async () => {
      mocks.getCriteria.mockReturnValue([]);
      mocks.getRatings.mockReturnValue([]);
      const criterion = new FakeCriterion();
      await runScript().removeCriterion(criterion);
      expect(mocks.runTransaction.mock.calls[0][0]).toBe(mocks.firestore);
      expect(mocks.runTransaction.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should update the weight of higher weighted criteria", async () => {
      mocks.getCriteria.mockReturnValue([
        {
          ref: "ref1",
          get: () => 1,
        },
        {
          ref: "ref3",
          get: () => 3,
        },
      ]);
      mocks.getRatings.mockReturnValue([]);
      mocks.increment.mockImplementation((n: number) => n);
      const criterion = new FakeCriterion({ id: "criterion2", weight: 2 });
      await runScript().removeCriterion(criterion);
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.update).toHaveBeenCalledWith("ref3", { weight: -1 });
      expect(transaction.update).toHaveBeenCalledTimes(1);
    });
    it("should delete associated ratings", async () => {
      mocks.getCriteria.mockReturnValue([]);
      mocks.getRatings.mockReturnValue([
        {
          ref: "ref1",
          get: () => "criterionId",
        },
        {
          ref: "ref2",
          get: () => "criterion2",
        },
      ]);
      const criterion = new FakeCriterion();
      await runScript().removeCriterion(criterion);
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith("ref1");
      expect(transaction.delete).not.toHaveBeenCalledWith("ref2");
    });
    it("should delete the criterion", async () => {
      mocks.criterionRef.mockImplementation((id) => `ref:${id}`);
      mocks.getCriteria.mockReturnValue([]);
      mocks.getRatings.mockReturnValue([]);
      const criterion = new FakeCriterion();
      await runScript().removeCriterion(criterion);
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith("ref:criterionId");
    });
  });
  describe("removeDecision", () => {
    it("should get options for the decision", async () => {
      await runScript().removeDecision("decisionId");
      expect(mocks.getOptions).toHaveBeenCalledWith("decisionId");
    });
    it("should get criteria for the decision", async () => {
      await runScript().removeDecision("decisionId");
      expect(mocks.getCriteria).toHaveBeenCalledWith("decisionId");
    });
    it("should get ratings for the decision", async () => {
      await runScript().removeDecision("decisionId");
      expect(mocks.getRatings).toHaveBeenCalledWith("decisionId");
    });
    it("should run a transaction", async () => {
      await runScript().removeDecision("decisionId");
      expect(mocks.runTransaction.mock.calls[0][0]).toBe(mocks.firestore);
      expect(mocks.runTransaction.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should delete the decision", async () => {
      mocks.decisionRef.mockImplementation((id) => ({ id }));
      mocks.getCriteria.mockReturnValue([]);
      mocks.getOptions.mockReturnValue([]);
      mocks.getRatings.mockReturnValue([]);
      await runScript().removeDecision("decisionId");
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith({ id: "decisionId" });
    });
    it("should delete the criteria", async () => {
      mocks.getCriteria.mockReturnValue([{ ref: { id: "criteriaId" } }]);
      mocks.getOptions.mockReturnValue([]);
      mocks.getRatings.mockReturnValue([]);
      await runScript().removeDecision("decisionId");
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith({ id: "criteriaId" });
    });
    it("should delete the options", async () => {
      mocks.getCriteria.mockReturnValue([]);
      mocks.getOptions.mockReturnValue([{ ref: { id: "optionId" } }]);
      mocks.getRatings.mockReturnValue([]);
      await runScript().removeDecision("decisionId");
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith({ id: "optionId" });
    });
    it("should delete the ratings", async () => {
      mocks.getCriteria.mockReturnValue([]);
      mocks.getOptions.mockReturnValue([]);
      mocks.getRatings.mockReturnValue([{ ref: { id: "ratingId" } }]);
      await runScript().removeDecision("decisionId");
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith({ id: "ratingId" });
    });
  });
  describe("removeOption", () => {
    it("should get ratings", async () => {
      const option = new FakeOption();
      await runScript().removeOption(option);
      expect(mocks.getRatings).toHaveBeenCalledWith("decisionId");
    });
    it("should run a transaction", async () => {
      const option = new FakeOption();
      await runScript().removeOption(option);
      expect(mocks.runTransaction.mock.calls[0][0]).toBe(mocks.firestore);
      expect(mocks.runTransaction.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should delete all ratings associated with the option", async () => {
      mocks.getRatings.mockReturnValue([
        {
          ref: {
            id: "rating1",
          },
          get: () => "optionId",
        },
        {
          ref: {
            id: "rating2",
          },
          get: () => "option2",
        },
      ]);
      const option = new FakeOption();
      await runScript().removeOption(option);
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith({ id: "rating1" });
      expect(transaction.delete).not.toHaveBeenCalledWith({ id: "rating2" });
    });
    it("should delete the option", async () => {
      mocks.getRatings.mockReturnValue([]);
      mocks.optionRef.mockImplementation((id) => ({ id }));
      const option = new FakeOption();
      await runScript().removeOption(option);
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith({ id: "optionId" });
    });
  });
  describe("setRatingsWeights", () => {
    it("should run a transaction", async () => {
      await runScript().setRatingsWeights([
        ["rating1", 1],
        ["rating2", 2],
      ]);
      expect(mocks.runTransaction.mock.calls[0][0]).toBe(mocks.firestore);
      expect(mocks.runTransaction.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should update each rating", async () => {
      mocks.ratingRef.mockImplementation((id) => ({ id }));
      await runScript().setRatingsWeights([
        ["rating1", 1],
        ["rating2", 2],
      ]);
      const updateFunction = mocks.runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.update).toHaveBeenCalledWith(
        { id: "rating1" },
        { weight: 1 }
      );
      expect(transaction.update).toHaveBeenCalledWith(
        { id: "rating2" },
        { weight: 2 }
      );
    });
  });
  describe("subscribeCriteria", () => {
    it("should query criteria", () => {
      runScript().subscribeCriteria("decisionId", () => {});
      expect(mocks.queryCriteria).toHaveBeenCalledWith("decisionId");
    });
    it("should subscribe to snapshot updates", () => {
      runScript().subscribeCriteria("decisionId", () => {});
      expect(mocks.onSnapshot.mock.calls[0][0]).toBe(
        mocks.queryCriteria.mock.results[0].value
      );
      expect(mocks.onSnapshot.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should merge id into each criterion record", () => {
      runScript().subscribeCriteria("decisionId", () => {});
      const onNext = mocks.onSnapshot.mock.calls[0][1];
      const docs = [{}, {}];
      onNext({ docs });
      expect(mocks.mergeId).toHaveBeenCalledWith(docs[0], 0, docs);
      expect(mocks.mergeId).toHaveBeenCalledWith(docs[1], 1, docs);
    });
    it("should invoke callback with criteria", () => {
      mocks.mergeId.mockImplementation(({ data, id }) => ({ id, ...data() }));
      const callback = jest.fn();
      runScript().subscribeCriteria("decisionId", callback);
      const onNext = mocks.onSnapshot.mock.calls[0][1];
      onNext({
        docs: [
          {
            id: "criteria1",
            data: () => ({}),
          },
          {
            id: "criteria2",
            data: () => ({}),
          },
        ],
      });
      expect(callback).toHaveBeenCalledWith([
        { id: "criteria1" },
        { id: "criteria2" },
      ]);
    });
    it("should return the result of onSnapshot", () => {
      const result = runScript().subscribeCriteria("decisionId", () => {});
      expect(result).toBe(mocks.onSnapshot.mock.results[0].value);
    });
  });
  describe("subscribeCreatorDecisions", () => {
    it("should query creator decisions", () => {
      const user = new FakeUser();
      runScript().subscribeCreatorDecisions(user, () => {});
      expect(mocks.queryCreatorDecisions).toHaveBeenCalledWith(user);
    });
    it("should subscribe to snapshot updates", () => {
      const user = new FakeUser();
      runScript().subscribeCreatorDecisions(user, () => {});
      expect(mocks.onSnapshot.mock.calls[0][0]).toBe(
        mocks.queryCreatorDecisions.mock.results[0].value
      );
      expect(mocks.onSnapshot.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should merge id into each criterion record", () => {
      const user = new FakeUser();
      runScript().subscribeCreatorDecisions(user, () => {});
      const onNext = mocks.onSnapshot.mock.calls[0][1];
      const docs = [{}, {}];
      onNext({ docs });
      expect(mocks.mergeId).toHaveBeenCalledWith(docs[0], 0, docs);
      expect(mocks.mergeId).toHaveBeenCalledWith(docs[1], 1, docs);
    });
    it("should invoke callback with criteria", () => {
      mocks.mergeId.mockImplementation(({ data, id }) => ({ id, ...data() }));
      const callback = jest.fn();
      const user = new FakeUser();
      runScript().subscribeCreatorDecisions(user, callback);
      const onNext = mocks.onSnapshot.mock.calls[0][1];
      onNext({
        docs: [
          {
            id: "decision1",
            data: () => ({}),
          },
          {
            id: "decision2",
            data: () => ({}),
          },
        ],
      });
      expect(callback).toHaveBeenCalledWith([
        { id: "decision1" },
        { id: "decision2" },
      ]);
    });
    it("should return the result of onSnapshot", () => {
      const user = new FakeUser();
      const result = runScript().subscribeCreatorDecisions(user, () => {});
      expect(result).toBe(mocks.onSnapshot.mock.results[0].value);
    });
  });
  describe("subscribeCollaboratorDecisions", () => {
    it("should query collaborator decisions", () => {
      const user = new FakeUser({ email: "user@example.com" });
      runScript().subscribeCollaboratorDecisions(user, () => {});
      expect(mocks.queryCollaboratorDecisions).toHaveBeenCalledWith(user);
    });
    it("should subscribe to snapshot updates", () => {
      const user = new FakeUser({ email: "user@example.com" });
      runScript().subscribeCollaboratorDecisions(user, () => {});
      expect(mocks.onSnapshot.mock.calls[0][0]).toBe(
        mocks.queryCollaboratorDecisions.mock.results[0].value
      );
      expect(mocks.onSnapshot.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should merge id into each criterion record", () => {
      const user = new FakeUser({ email: "user@example.com" });
      runScript().subscribeCollaboratorDecisions(user, () => {});
      const onNext = mocks.onSnapshot.mock.calls[0][1];
      const docs = [{}, {}];
      onNext({ docs });
      expect(mocks.mergeId).toHaveBeenCalledWith(docs[0], 0, docs);
      expect(mocks.mergeId).toHaveBeenCalledWith(docs[1], 1, docs);
    });
    it("should invoke callback with criteria", () => {
      mocks.mergeId.mockImplementation(({ data, id }) => ({ id, ...data() }));
      const callback = jest.fn();
      const user = new FakeUser({ email: "user@example.com" });
      runScript().subscribeCollaboratorDecisions(user, callback);
      const onNext = mocks.onSnapshot.mock.calls[0][1];
      onNext({
        docs: [
          {
            id: "decision1",
            data: () => ({}),
          },
          {
            id: "decision2",
            data: () => ({}),
          },
        ],
      });
      expect(callback).toHaveBeenCalledWith([
        { id: "decision1" },
        { id: "decision2" },
      ]);
    });
    it("should return the result of onSnapshot", () => {
      const user = new FakeUser({ email: "user@example.com" });
      const result = runScript().subscribeCollaboratorDecisions(user, () => {});
      expect(result).toBe(mocks.onSnapshot.mock.results[0].value);
    });
  });
  describe("subscribeOptions", () => {
    it("should query options", () => {
      runScript().subscribeOptions("decisionId", () => {});
      expect(mocks.queryOptions).toHaveBeenCalledWith("decisionId");
    });
    it("should subscribe to snapshot updates", () => {
      runScript().subscribeOptions("decisionId", () => {});
      expect(mocks.onSnapshot.mock.calls[0][0]).toBe(
        mocks.queryOptions.mock.results[0].value
      );
      expect(mocks.onSnapshot.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should merge id into each option record", () => {
      runScript().subscribeOptions("decisionId", () => {});
      const onNext = mocks.onSnapshot.mock.calls[0][1];
      const docs = [{}, {}];
      onNext({ docs });
      expect(mocks.mergeId).toHaveBeenCalledWith(docs[0], 0, docs);
      expect(mocks.mergeId).toHaveBeenCalledWith(docs[1], 1, docs);
    });
    it("should invoke callback with criteria", () => {
      mocks.mergeId.mockImplementation(({ data, id }) => ({ id, ...data() }));
      const callback = jest.fn();
      runScript().subscribeOptions("decisionId", callback);
      const onNext = mocks.onSnapshot.mock.calls[0][1];
      onNext({
        docs: [
          {
            id: "option1",
            data: () => ({}),
          },
          {
            id: "option2",
            data: () => ({}),
          },
        ],
      });
      expect(callback).toHaveBeenCalledWith([
        { id: "option1" },
        { id: "option2" },
      ]);
    });
    it("should return the result of onSnapshot", () => {
      const result = runScript().subscribeOptions("decisionId", () => {});
      expect(result).toBe(mocks.onSnapshot.mock.results[0].value);
    });
  });
  describe("subscribeRatings", () => {
    it("should query ratings", () => {
      runScript().subscribeRatings("decisionId", () => {});
      expect(mocks.queryRatings).toHaveBeenCalledWith("decisionId");
    });
    it("should subscribe to snapshot updates", () => {
      runScript().subscribeRatings("decisionId", () => {});
      expect(mocks.onSnapshot.mock.calls[0][0]).toBe(
        mocks.queryRatings.mock.results[0].value
      );
      expect(mocks.onSnapshot.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should merge id into each rating record", () => {
      runScript().subscribeRatings("decisionId", () => {});
      const onNext = mocks.onSnapshot.mock.calls[0][1];
      const docs = [{}, {}];
      onNext({ docs });
      expect(mocks.mergeId).toHaveBeenCalledWith(docs[0], 0, docs);
      expect(mocks.mergeId).toHaveBeenCalledWith(docs[1], 1, docs);
    });
    it("should invoke callback with criteria", () => {
      mocks.mergeId.mockImplementation(({ data, id }) => ({ id, ...data() }));
      const callback = jest.fn();
      runScript().subscribeRatings("decisionId", callback);
      const onNext = mocks.onSnapshot.mock.calls[0][1];
      onNext({
        docs: [
          {
            id: "option1",
            data: () => ({}),
          },
          {
            id: "option2",
            data: () => ({}),
          },
        ],
      });
      expect(callback).toHaveBeenCalledWith([
        { id: "option1" },
        { id: "option2" },
      ]);
    });
    it("should return the result of onSnapshot", () => {
      const result = runScript().subscribeRatings("decisionId", () => {});
      expect(result).toBe(mocks.onSnapshot.mock.results[0].value);
    });
  });
  describe("updateCriterion", () => {
    it("should update the title and weight of the specified criterion", () => {
      const criterion = new FakeCriterion();
      runScript().updateCriterion(criterion);
      expect(mocks.criterionRef).toHaveBeenCalledWith("criterionId");
      expect(mocks.updateDoc).toHaveBeenCalledWith(
        mocks.criterionRef.mock.results[0].value,
        {
          title: "criterion title",
          weight: 1,
        }
      );
    });
  });
  describe("updateDecision", () => {
    it("should update the collaborators and title of the specified decision", () => {
      const decision = new FakeDecision();
      const collaborators = (decision.collaborators = ["friend@example.com"]);
      const title = (decision.title = "New title");
      runScript().updateDecision(decision);
      expect(mocks.decisionRef).toHaveBeenCalledWith("decisionId");
      expect(mocks.updateDoc).toHaveBeenLastCalledWith(
        mocks.decisionRef.mock.results[0].value,
        {
          collaborators,
          title,
        }
      );
    });
  });
  describe("updateOption", () => {
    it("should update the title of the specified option", () => {
      const option = new FakeOption();
      const title = (option.title = "New title");
      runScript().updateOption(option);
      expect(mocks.optionRef).toHaveBeenCalledWith("optionId");
      expect(mocks.updateDoc).toHaveBeenLastCalledWith(
        mocks.optionRef.mock.results[0].value,
        {
          title,
        }
      );
    });
  });
  describe("updateRating", () => {
    it("should update the weight of the specified rating", () => {
      const rating = new FakeRating();
      const weight = (rating.weight = 5);
      runScript().updateRating(rating);
      expect(mocks.ratingRef).toHaveBeenCalledWith("ratingId");
      expect(mocks.updateDoc).toHaveBeenLastCalledWith(
        mocks.ratingRef.mock.results[0].value,
        {
          weight,
        }
      );
    });
  });
});
