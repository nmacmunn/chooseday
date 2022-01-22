import {
  FakeCriterion,
  FakeDecision,
  FakeOption,
  FakeRating,
  FakeTransaction,
  FakeUser,
} from "../helpers/fake";
jest.unmock("../helpers/fake");

const Firestore = () => jest.requireMock("@firebase/firestore");
const Collection = () => jest.requireMock("../../src/service/collection");
const Docs = () => jest.requireMock("../../src/service/docs");
const Query = () => jest.requireMock("../../src/service/query");
const FirestoreUtil = () => jest.requireMock("../../src/util/firestore");

const runScript = () => jest.requireActual("../../src/service/db");

describe("db service", () => {
  beforeEach(() => jest.resetModules());
  describe("addCriterion", () => {
    it("should get options", async () => {
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      expect(Docs().getOptions).toHaveBeenCalledWith("decisionId");
    });
    it("should get criteria", async () => {
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      expect(Docs().getCriteria).toHaveBeenCalledWith("decisionId", {
        id: "userId",
      });
    });
    it("should run a transaction", async () => {
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      expect(Firestore().runTransaction).toHaveBeenCalledWith(
        Collection().firestore,
        expect.any(Function)
      );
    });
    it("should increment each criteria weight", async () => {
      Docs().getCriteria.mockReturnValue([{ ref: "ref1" }, { ref: "ref2" }]);
      Docs().getOptions.mockReturnValue([]);
      Firestore().increment.mockReturnValueOnce(1).mockReturnValueOnce(2);
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.update).toHaveBeenCalledWith("ref1", { weight: 1 });
      expect(transaction.update).toHaveBeenCalledWith("ref2", { weight: 2 });
    });
    it("should create a new criterion", async () => {
      Docs().getCriteria.mockReturnValue([]);
      Docs().getOptions.mockReturnValue([]);
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(Docs().criterionRef).toHaveBeenCalled();
      expect(transaction.set).toHaveBeenCalledWith(
        Docs().criterionRef.mock.results[0].value,
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
      Docs().getCriteria.mockReturnValue([]);
      Docs().getOptions.mockReturnValue([{ id: "option1" }, { id: "option2" }]);
      Docs().criterionRef.mockReturnValue({ id: "criterionId" });
      await runScript().addCriterion("decisionId", "criteria", {
        id: "userId",
      });
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(Docs().ratingRef).toHaveBeenCalledTimes(2);
      expect(transaction.set).toHaveBeenCalledWith(
        Docs().ratingRef.mock.results[0].value,
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
        Docs().ratingRef.mock.results[1].value,
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
    it("should get a document reference", () => {
      runScript().addDecision(new FakeUser(), "decision title");
      expect(Firestore().doc).toHaveBeenCalledWith(
        Collection().decisionCollection
      );
    });
    it("should add a document to decisionCollection", () => {
      jest.spyOn(Date, "now").mockReturnValue(1234567890);
      Firestore().doc.mockReturnValue({ id: "decisionId" });
      runScript().addDecision(new FakeUser(), "decision title");
      expect(Firestore().setDoc).toHaveBeenCalledWith(
        { id: "decisionId" },
        {
          collaborators: [],
          created: 1234567890,
          creator: { id: "userId" },
          title: "decision title",
        }
      );
    });
    it("should return the document id", () => {
      Firestore().doc.mockReturnValue({ id: "decisionId" });
      const result = runScript().addDecision(new FakeUser(), "decision title");
      expect(result).toEqual("decisionId");
    });
  });
  describe("addOption", () => {
    it("should get criteria", async () => {
      await runScript().addOption("decisionId", "option");
      expect(Docs().getCriteria).toHaveBeenCalledWith("decisionId");
    });
    it("should run a transaction", async () => {
      await runScript().addOption("decisionId", "option");
      expect(Firestore().runTransaction).toHaveBeenCalledWith(
        Collection().firestore,
        expect.any(Function)
      );
    });
    it("should create a new option", async () => {
      jest.spyOn(Date, "now").mockReturnValue(1234567890);
      Docs().getCriteria.mockReturnValue([]);
      await runScript().addOption("decisionId", "option");
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(Docs().optionRef).toHaveBeenCalled();
      expect(transaction.set).toHaveBeenCalledWith(
        Docs().optionRef.mock.results[0].value,
        {
          created: 1234567890,
          decisionId: "decisionId",
          title: "option",
        }
      );
    });
    it("should add a new rating for each criterion", async () => {
      Docs().getCriteria.mockReturnValue([
        {
          id: "criterion1",
          get: () => ({ id: "user1" }),
        },
        {
          id: "criterion2",
          get: () => ({ id: "user2" }),
        },
      ]);
      Docs().optionRef.mockReturnValue({ id: "option1" });
      await runScript().addOption("decisionId", "option");
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.set).toHaveBeenCalledWith(
        Docs().ratingRef.mock.results[0].value,
        {
          criterionId: "criterion1",
          decisionId: "decisionId",
          optionId: "option1",
          user: { id: "user1" },
          weight: 1,
        }
      );
      expect(transaction.set).toHaveBeenCalledWith(
        Docs().ratingRef.mock.results[1].value,
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
      expect(Docs().getCriteria).toHaveBeenCalledWith("decisionId", {
        id: "userId",
      });
    });
    it("should get ratings", async () => {
      const criterion = new FakeCriterion();
      await runScript().removeCriterion(criterion);
      expect(Docs().getRatings).toHaveBeenCalledWith("decisionId", {
        id: "userId",
      });
    });
    it("should run a transaction", async () => {
      Docs().getCriteria.mockReturnValue([]);
      Docs().getRatings.mockReturnValue([]);
      const criterion = new FakeCriterion();
      await runScript().removeCriterion(criterion);
      expect(Firestore().runTransaction.mock.calls[0][0]).toBe(
        Collection().firestore
      );
      expect(Firestore().runTransaction.mock.calls[0][1]).toBeInstanceOf(
        Function
      );
    });
    it("should update the weight of higher weighted criteria", async () => {
      Docs().getCriteria.mockReturnValue([
        {
          ref: "ref1",
          get: () => 1,
        },
        {
          ref: "ref3",
          get: () => 3,
        },
      ]);
      Docs().getRatings.mockReturnValue([]);
      Firestore().increment.mockImplementation((n: number) => n);
      const criterion = new FakeCriterion({ id: "criterion2", weight: 2 });
      await runScript().removeCriterion(criterion);
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.update).toHaveBeenCalledWith("ref3", { weight: -1 });
      expect(transaction.update).toHaveBeenCalledTimes(1);
    });
    it("should delete associated ratings", async () => {
      Docs().getCriteria.mockReturnValue([]);
      Docs().getRatings.mockReturnValue([
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
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith("ref1");
      expect(transaction.delete).not.toHaveBeenCalledWith("ref2");
    });
    it("should delete the criterion", async () => {
      Docs().criterionRef.mockImplementation((id) => `ref:${id}`);
      Docs().getCriteria.mockReturnValue([]);
      Docs().getRatings.mockReturnValue([]);
      const criterion = new FakeCriterion();
      await runScript().removeCriterion(criterion);
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith("ref:criterionId");
    });
  });
  describe("removeDecision", () => {
    it("should get options for the decision", async () => {
      await runScript().removeDecision("decisionId");
      expect(Docs().getOptions).toHaveBeenCalledWith("decisionId");
    });
    it("should get criteria for the decision", async () => {
      await runScript().removeDecision("decisionId");
      expect(Docs().getCriteria).toHaveBeenCalledWith("decisionId");
    });
    it("should get ratings for the decision", async () => {
      await runScript().removeDecision("decisionId");
      expect(Docs().getRatings).toHaveBeenCalledWith("decisionId");
    });
    it("should run a transaction", async () => {
      await runScript().removeDecision("decisionId");
      expect(Firestore().runTransaction.mock.calls[0][0]).toBe(
        Collection().firestore
      );
      expect(Firestore().runTransaction.mock.calls[0][1]).toBeInstanceOf(
        Function
      );
    });
    it("should delete the decision", async () => {
      Docs().decisionRef.mockImplementation((id) => ({ id }));
      Docs().getCriteria.mockReturnValue([]);
      Docs().getOptions.mockReturnValue([]);
      Docs().getRatings.mockReturnValue([]);
      await runScript().removeDecision("decisionId");
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith({ id: "decisionId" });
    });
    it("should delete the criteria", async () => {
      Docs().getCriteria.mockReturnValue([{ ref: { id: "criteriaId" } }]);
      Docs().getOptions.mockReturnValue([]);
      Docs().getRatings.mockReturnValue([]);
      await runScript().removeDecision("decisionId");
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith({ id: "criteriaId" });
    });
    it("should delete the options", async () => {
      Docs().getCriteria.mockReturnValue([]);
      Docs().getOptions.mockReturnValue([{ ref: { id: "optionId" } }]);
      Docs().getRatings.mockReturnValue([]);
      await runScript().removeDecision("decisionId");
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith({ id: "optionId" });
    });
    it("should delete the ratings", async () => {
      Docs().getCriteria.mockReturnValue([]);
      Docs().getOptions.mockReturnValue([]);
      Docs().getRatings.mockReturnValue([{ ref: { id: "ratingId" } }]);
      await runScript().removeDecision("decisionId");
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith({ id: "ratingId" });
    });
  });
  describe("removeOption", () => {
    it("should get ratings", async () => {
      const option = new FakeOption();
      await runScript().removeOption(option);
      expect(Docs().getRatings).toHaveBeenCalledWith("decisionId");
    });
    it("should run a transaction", async () => {
      const option = new FakeOption();
      await runScript().removeOption(option);
      expect(Firestore().runTransaction.mock.calls[0][0]).toBe(
        Collection().firestore
      );
      expect(Firestore().runTransaction.mock.calls[0][1]).toBeInstanceOf(
        Function
      );
    });
    it("should delete all ratings associated with the option", async () => {
      Docs().getRatings.mockReturnValue([
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
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
      const transaction = new FakeTransaction();
      updateFunction(transaction);
      expect(transaction.delete).toHaveBeenCalledWith({ id: "rating1" });
      expect(transaction.delete).not.toHaveBeenCalledWith({ id: "rating2" });
    });
    it("should delete the option", async () => {
      Docs().getRatings.mockReturnValue([]);
      Docs().optionRef.mockImplementation((id) => ({ id }));
      const option = new FakeOption();
      await runScript().removeOption(option);
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
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
      expect(Firestore().runTransaction.mock.calls[0][0]).toBe(
        Collection().firestore
      );
      expect(Firestore().runTransaction.mock.calls[0][1]).toBeInstanceOf(
        Function
      );
    });
    it("should update each rating", async () => {
      Docs().ratingRef.mockImplementation((id) => ({ id }));
      await runScript().setRatingsWeights([
        ["rating1", 1],
        ["rating2", 2],
      ]);
      const updateFunction = Firestore().runTransaction.mock.calls[0][1];
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
      expect(Query().queryCriteria).toHaveBeenCalledWith("decisionId");
    });
    it("should subscribe to snapshot updates", () => {
      runScript().subscribeCriteria("decisionId", () => {});
      expect(Firestore().onSnapshot.mock.calls[0][0]).toBe(
        Query().queryCriteria.mock.results[0].value
      );
      expect(Firestore().onSnapshot.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should merge id into each criterion record", () => {
      runScript().subscribeCriteria("decisionId", () => {});
      const onNext = Firestore().onSnapshot.mock.calls[0][1];
      const docs = [{}, {}];
      onNext({ docs });
      expect(FirestoreUtil().mergeId).toHaveBeenCalledWith(docs[0], 0, docs);
      expect(FirestoreUtil().mergeId).toHaveBeenCalledWith(docs[1], 1, docs);
    });
    it("should invoke callback with criteria", () => {
      FirestoreUtil().mergeId.mockImplementation(({ data, id }) => ({
        id,
        ...data(),
      }));
      const callback = jest.fn();
      runScript().subscribeCriteria("decisionId", callback);
      const onNext = Firestore().onSnapshot.mock.calls[0][1];
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
      expect(result).toBe(Firestore().onSnapshot.mock.results[0].value);
    });
  });
  describe("subscribeCreatorDecisions", () => {
    it("should query creator decisions", () => {
      const user = new FakeUser();
      runScript().subscribeCreatorDecisions(user, () => {});
      expect(Query().queryCreatorDecisions).toHaveBeenCalledWith(user);
    });
    it("should subscribe to snapshot updates", () => {
      const user = new FakeUser();
      runScript().subscribeCreatorDecisions(user, () => {});
      expect(Firestore().onSnapshot.mock.calls[0][0]).toBe(
        Query().queryCreatorDecisions.mock.results[0].value
      );
      expect(Firestore().onSnapshot.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should merge id into each criterion record", () => {
      const user = new FakeUser();
      runScript().subscribeCreatorDecisions(user, () => {});
      const onNext = Firestore().onSnapshot.mock.calls[0][1];
      const docs = [{}, {}];
      onNext({ docs });
      expect(FirestoreUtil().mergeId).toHaveBeenCalledWith(docs[0], 0, docs);
      expect(FirestoreUtil().mergeId).toHaveBeenCalledWith(docs[1], 1, docs);
    });
    it("should invoke callback with criteria", () => {
      FirestoreUtil().mergeId.mockImplementation(({ data, id }) => ({
        id,
        ...data(),
      }));
      const callback = jest.fn();
      const user = new FakeUser();
      runScript().subscribeCreatorDecisions(user, callback);
      const onNext = Firestore().onSnapshot.mock.calls[0][1];
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
      expect(result).toBe(Firestore().onSnapshot.mock.results[0].value);
    });
  });
  describe("subscribeCollaboratorDecisions", () => {
    it("should query collaborator decisions", () => {
      const user = new FakeUser({ email: "user@example.com" });
      runScript().subscribeCollaboratorDecisions(user, () => {});
      expect(Query().queryCollaboratorDecisions).toHaveBeenCalledWith(user);
    });
    it("should subscribe to snapshot updates", () => {
      const user = new FakeUser({ email: "user@example.com" });
      runScript().subscribeCollaboratorDecisions(user, () => {});
      expect(Firestore().onSnapshot.mock.calls[0][0]).toBe(
        Query().queryCollaboratorDecisions.mock.results[0].value
      );
      expect(Firestore().onSnapshot.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should merge id into each criterion record", () => {
      const user = new FakeUser({ email: "user@example.com" });
      runScript().subscribeCollaboratorDecisions(user, () => {});
      const onNext = Firestore().onSnapshot.mock.calls[0][1];
      const docs = [{}, {}];
      onNext({ docs });
      expect(FirestoreUtil().mergeId).toHaveBeenCalledWith(docs[0], 0, docs);
      expect(FirestoreUtil().mergeId).toHaveBeenCalledWith(docs[1], 1, docs);
    });
    it("should invoke callback with criteria", () => {
      FirestoreUtil().mergeId.mockImplementation(({ data, id }) => ({
        id,
        ...data(),
      }));
      const callback = jest.fn();
      const user = new FakeUser({ email: "user@example.com" });
      runScript().subscribeCollaboratorDecisions(user, callback);
      const onNext = Firestore().onSnapshot.mock.calls[0][1];
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
      expect(result).toBe(Firestore().onSnapshot.mock.results[0].value);
    });
  });
  describe("subscribeOptions", () => {
    it("should query options", () => {
      runScript().subscribeOptions("decisionId", () => {});
      expect(Query().queryOptions).toHaveBeenCalledWith("decisionId");
    });
    it("should subscribe to snapshot updates", () => {
      runScript().subscribeOptions("decisionId", () => {});
      expect(Firestore().onSnapshot.mock.calls[0][0]).toBe(
        Query().queryOptions.mock.results[0].value
      );
      expect(Firestore().onSnapshot.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should merge id into each option record", () => {
      runScript().subscribeOptions("decisionId", () => {});
      const onNext = Firestore().onSnapshot.mock.calls[0][1];
      const docs = [{}, {}];
      onNext({ docs });
      expect(FirestoreUtil().mergeId).toHaveBeenCalledWith(docs[0], 0, docs);
      expect(FirestoreUtil().mergeId).toHaveBeenCalledWith(docs[1], 1, docs);
    });
    it("should invoke callback with criteria", () => {
      FirestoreUtil().mergeId.mockImplementation(({ data, id }) => ({
        id,
        ...data(),
      }));
      const callback = jest.fn();
      runScript().subscribeOptions("decisionId", callback);
      const onNext = Firestore().onSnapshot.mock.calls[0][1];
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
      expect(result).toBe(Firestore().onSnapshot.mock.results[0].value);
    });
  });
  describe("subscribeRatings", () => {
    it("should query ratings", () => {
      runScript().subscribeRatings("decisionId", () => {});
      expect(Query().queryRatings).toHaveBeenCalledWith("decisionId");
    });
    it("should subscribe to snapshot updates", () => {
      runScript().subscribeRatings("decisionId", () => {});
      expect(Firestore().onSnapshot.mock.calls[0][0]).toBe(
        Query().queryRatings.mock.results[0].value
      );
      expect(Firestore().onSnapshot.mock.calls[0][1]).toBeInstanceOf(Function);
    });
    it("should merge id into each rating record", () => {
      runScript().subscribeRatings("decisionId", () => {});
      const onNext = Firestore().onSnapshot.mock.calls[0][1];
      const docs = [{}, {}];
      onNext({ docs });
      expect(FirestoreUtil().mergeId).toHaveBeenCalledWith(docs[0], 0, docs);
      expect(FirestoreUtil().mergeId).toHaveBeenCalledWith(docs[1], 1, docs);
    });
    it("should invoke callback with criteria", () => {
      FirestoreUtil().mergeId.mockImplementation(({ data, id }) => ({
        id,
        ...data(),
      }));
      const callback = jest.fn();
      runScript().subscribeRatings("decisionId", callback);
      const onNext = Firestore().onSnapshot.mock.calls[0][1];
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
      expect(result).toBe(Firestore().onSnapshot.mock.results[0].value);
    });
  });
  describe("updateCriterion", () => {
    it("should update the title and weight of the specified criterion", () => {
      const criterion = new FakeCriterion();
      runScript().updateCriterion(criterion);
      expect(Docs().criterionRef).toHaveBeenCalledWith("criterionId");
      expect(Firestore().updateDoc).toHaveBeenCalledWith(
        Docs().criterionRef.mock.results[0].value,
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
      expect(Docs().decisionRef).toHaveBeenCalledWith("decisionId");
      expect(Firestore().updateDoc).toHaveBeenLastCalledWith(
        Docs().decisionRef.mock.results[0].value,
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
      expect(Docs().optionRef).toHaveBeenCalledWith("optionId");
      expect(Firestore().updateDoc).toHaveBeenLastCalledWith(
        Docs().optionRef.mock.results[0].value,
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
      expect(Docs().ratingRef).toHaveBeenCalledWith("ratingId");
      expect(Firestore().updateDoc).toHaveBeenLastCalledWith(
        Docs().ratingRef.mock.results[0].value,
        {
          weight,
        }
      );
    });
  });
});
