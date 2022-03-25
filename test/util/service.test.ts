import { FakeDecision, FakeUser } from "../helpers/fake";
jest.unmock("../helpers/fake");

const Auth = () => jest.requireMock("../../src/service/auth");
const History = () => jest.requireMock("../../src/util/history");
const User = () => jest.requireMock("../../src/util/user");
const Context = () => jest.requireMock("../../src/util/context");
const Db = () => jest.requireMock("../../src/service/db");

const runScript = () => jest.requireActual("../../src/util/service");

describe("service util", () => {
  beforeEach(() => jest.resetModules());
  describe("decisionListener", () => {
    it("should return a callbackHandler", () => {
      const { decisionListener } = runScript();
      expect(decisionListener({})).toEqual(expect.any(Function));
    });
    describe("callbackHandler", () => {
      it("should send ERROR if context is invalid", () => {
        Context().isDecisionLoadingContext.mockReturnValue(false);
        const context = {};
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(send).toHaveBeenCalledWith({
          type: "ERROR",
          error: "Failed to load decision",
        });
      });
      it("should subscribe to the decision", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(Db().subscribeDecision).toHaveBeenCalledWith(
          "decisionId",
          expect.any(Function)
        );
      });
      it("should send ERROR if the decision is undefined", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeDecision.mock.calls[0];
        callback(undefined);
        expect(send).toHaveBeenCalledWith({
          type: "ERROR",
          error: "That decision doesn't exist or collaboration isn't enabled.",
        });
      });
      it("should send DECISIONLOADED if it was created by the user", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
          user: new FakeUser(),
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeDecision.mock.calls[0];
        const decision = new FakeDecision();
        callback(decision);
        expect(send).toHaveBeenCalledWith({
          type: "DECISIONLOADED",
          decision,
        });
      });
      it("should send ERROR if collaboration is not enabled", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        User().hasEmail.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
          user: new FakeUser({ id: "friendId" }),
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeDecision.mock.calls[0];
        const decision = new FakeDecision({ collaborators: null });
        callback(decision);
        expect(send).toHaveBeenCalledWith({
          type: "ERROR",
          error: "That decision doesn't exist or collaboration isn't enabled.",
        });
      });
      it("should send ERROR if user does not have an email", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        User().hasEmail.mockReturnValue(false);
        const context = {
          decisionId: "decisionId",
          user: new FakeUser({ id: "friendId" }),
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeDecision.mock.calls[0];
        const decision = new FakeDecision();
        callback(decision);
        expect(send).toHaveBeenCalledWith({
          type: "ERROR",
          error: "You have to be signed in with Google to collaborate.",
        });
      });
      it("should add a new collaborator", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        User().hasEmail.mockReturnValue(true);
        const user = new FakeUser({
          id: "friendId",
        });
        const context = {
          decisionId: "decisionId",
          user,
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeDecision.mock.calls[0];
        const decision = new FakeDecision();
        callback(decision);
        expect(Db().addCollaborator).toHaveBeenCalledWith(decision, user);
      });
      it("should send DECISIONLOADED for new collaborators", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        User().hasEmail.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
          user: new FakeUser({ id: "friendId" }),
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeDecision.mock.calls[0];
        const decision = new FakeDecision();
        callback(decision);
        expect(send).toHaveBeenCalledWith({
          type: "DECISIONLOADED",
          decision,
        });
      });
      it("should send ERROR if user has been removed", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        User().hasEmail.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
          user: new FakeUser({ id: "friendId" }),
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeDecision.mock.calls[0];
        const decision = new FakeDecision({
          collaborators: {
            friendId: { id: "friendId", email: "", active: false },
          },
        });
        callback(decision);
        expect(send).toHaveBeenCalledWith({
          type: "ERROR",
          error: "That decision doesn't exist or collaboration isn't enabled.",
        });
      });
      it("should send DECISIONLOADED for returning collaborators", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        User().hasEmail.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
          user: new FakeUser({ id: "friendId" }),
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeDecision.mock.calls[0];
        const decision = new FakeDecision({
          collaborators: {
            friendId: { id: "friendId", email: "", active: true },
          },
        });
        callback(decision);
        expect(send).toHaveBeenCalledWith({
          type: "DECISIONLOADED",
          decision,
        });
      });
      it("should subscribe to options", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(Db().subscribeOptions).toHaveBeenCalledWith(
          "decisionId",
          expect.any(Function)
        );
      });
      it("should send OPTIONSLOADED when options change", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeOptions.mock.calls[0];
        const options = [];
        callback(options);
        expect(send).toHaveBeenCalledWith({ type: "OPTIONSLOADED", options });
      });
      it("should subscribe to criteria", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(Db().subscribeCriteria).toHaveBeenCalledWith(
          "decisionId",
          expect.any(Function)
        );
      });
      it("should send CRITERIALOADED when criteria change", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeCriteria.mock.calls[0];
        const criteria = [];
        callback(criteria);
        expect(send).toHaveBeenCalledWith({ type: "CRITERIALOADED", criteria });
      });
      it("should subscribe to ratings", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(Db().subscribeRatings).toHaveBeenCalledWith(
          "decisionId",
          expect.any(Function)
        );
      });
      it("should send RATINGSLOADED when ratings change", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeRatings.mock.calls[0];
        const ratings = [];
        callback(ratings);
        expect(send).toHaveBeenCalledWith({ type: "RATINGSLOADED", ratings });
      });
      it("should return an unsubscribe function", () => {
        Context().isDecisionLoadingContext.mockReturnValue(true);
        const context = {
          decisionId: "decisionId",
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        const unsubscribe = callbackHandler(send);
        expect(unsubscribe).toEqual(expect.any(Function));
      });
      describe("unsubscribe", () => {
        beforeEach(() => {
          Db().subscribeCriteria.mockReturnValue(jest.fn());
          Db().subscribeDecision.mockReturnValue(jest.fn());
          Db().subscribeOptions.mockReturnValue(jest.fn());
          Db().subscribeRatings.mockReturnValue(jest.fn());
        });
        it("should unsubscribe from options changes", () => {
          Context().isDecisionLoadingContext.mockReturnValue(true);
          const context = {
            decisionId: "decisionId",
          };
          const callbackHandler = runScript().decisionListener(context);
          const send = jest.fn();
          const unsubscribe = callbackHandler(send);
          unsubscribe();
          expect(
            Db().subscribeOptions.mock.results[0].value
          ).toHaveBeenCalled();
        });
        it("should unsubscribe from criteria changes", () => {
          Context().isDecisionLoadingContext.mockReturnValue(true);
          const context = {
            decisionId: "decisionId",
          };
          const callbackHandler = runScript().decisionListener(context);
          const send = jest.fn();
          const unsubscribe = callbackHandler(send);
          unsubscribe();
          expect(
            Db().subscribeCriteria.mock.results[0].value
          ).toHaveBeenCalled();
        });
        it("should unsubscribe from ratings changes", () => {
          Context().isDecisionLoadingContext.mockReturnValue(true);
          const context = {
            decisionId: "decisionId",
          };
          const callbackHandler = runScript().decisionListener(context);
          const send = jest.fn();
          const unsubscribe = callbackHandler(send);
          unsubscribe();
          expect(
            Db().subscribeRatings.mock.results[0].value
          ).toHaveBeenCalled();
        });
      });
    });
  });
  describe("decisionsListener", () => {
    it("should return a callback handler", () => {
      const { decisionsListener } = runScript();
      expect(decisionsListener({})).toEqual(expect.any(Function));
    });
    describe("callback handler", () => {
      it("should send ERROR if context is invalid", () => {
        Context().isDecisionsLoadingContext.mockReturnValue(false);
        const context = {};
        const callbackHandler = runScript().decisionsListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(send).toHaveBeenCalledWith({
          type: "ERROR",
          error: "Failed to load decisions",
        });
      });
      it("should subscribe to creator decisions", () => {
        Context().isDecisionsLoadingContext.mockReturnValue(true);
        const user = new FakeUser();
        const context = {
          user,
        };
        const callbackHandler = runScript().decisionsListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(Db().subscribeCreatorDecisions).toHaveBeenCalledWith(
          user,
          expect.any(Function)
        );
      });
      it("should send CREATORDECISIONSLOADED when decisions change", () => {
        Context().isDecisionsLoadingContext.mockReturnValue(true);
        const user = new FakeUser();
        const context = {
          user,
        };
        const callbackHandler = runScript().decisionsListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = Db().subscribeCreatorDecisions.mock.calls[0];
        const decisions = [];
        callback(decisions);
        expect(send).toHaveBeenCalledWith({
          type: "CREATORDECISIONSLOADED",
          decisions,
        });
      });
      describe("user does not have an email", () => {
        it("should send COLLABORATORDECISIONSLOADED once", () => {
          Context().isDecisionsLoadingContext.mockReturnValue(true);
          User().hasEmail.mockReturnValue(false);
          const user = new FakeUser();
          const context = {
            user,
          };
          const callbackHandler = runScript().decisionsListener(context);
          const send = jest.fn();
          callbackHandler(send);
          expect(send).toHaveBeenCalledWith({
            type: "COLLABORATORDECISIONSLOADED",
            decisions: [],
          });
        });
        it("should return the creator decisions unsubscribe function", () => {
          Context().isDecisionsLoadingContext.mockReturnValue(true);
          User().hasEmail.mockReturnValue(false);
          const user = new FakeUser();
          const context = {
            user,
          };
          const unsubscribe = () => undefined;
          Db().subscribeCreatorDecisions.mockReturnValue(unsubscribe);
          const callbackHandler = runScript().decisionsListener(context);
          const send = jest.fn();
          expect(callbackHandler(send)).toBe(unsubscribe);
        });
      });
      describe("user has email", () => {
        it("should subscribe to collaborator decisions", () => {
          Context().isDecisionsLoadingContext.mockReturnValue(true);
          User().hasEmail.mockReturnValue(true);
          const user = new FakeUser();
          const context = {
            user,
          };
          const callbackHandler = runScript().decisionsListener(context);
          const send = jest.fn();
          callbackHandler(send);
          expect(Db().subscribeCollaboratorDecisions).toHaveBeenCalledWith(
            user,
            expect.any(Function)
          );
        });
        it("should send COLLABORATORDECISIONSLOADED when decisions change", () => {
          Context().isDecisionsLoadingContext.mockReturnValue(true);
          User().hasEmail.mockReturnValue(true);
          const user = new FakeUser();
          const context = {
            user,
          };
          const callbackHandler = runScript().decisionsListener(context);
          const send = jest.fn();
          callbackHandler(send);
          const [, callback] =
            Db().subscribeCollaboratorDecisions.mock.calls[0];
          const decisions = [];
          callback(decisions);
          expect(send).toHaveBeenCalledWith({
            type: "COLLABORATORDECISIONSLOADED",
            decisions,
          });
        });
        it("should return an unsubscribe function", () => {
          Context().isDecisionsLoadingContext.mockReturnValue(true);
          User().hasEmail.mockReturnValue(true);
          const user = new FakeUser();
          const context = {
            user,
          };
          const callbackHandler = runScript().decisionsListener(context);
          const send = jest.fn();
          const unsubscribe = callbackHandler(send);
          expect(unsubscribe).toEqual(expect.any(Function));
        });
        describe("unsubscribe", () => {
          beforeEach(() => {
            Db().subscribeCreatorDecisions.mockReturnValue(jest.fn());
            Db().subscribeCollaboratorDecisions.mockReturnValue(jest.fn());
          });
          it("should unsubscribe from creator decision changes", () => {
            Context().isDecisionsLoadingContext.mockReturnValue(true);
            User().hasEmail.mockReturnValue(true);
            const user = new FakeUser();
            const context = {
              user,
            };
            const callbackHandler = runScript().decisionsListener(context);
            const send = jest.fn();
            const unsubscribe = callbackHandler(send);
            unsubscribe();
            expect(
              Db().subscribeCreatorDecisions.mock.results[0].value
            ).toHaveBeenCalled();
          });
          it("should unsubscribe from collaborator decision changes", () => {
            Context().isDecisionsLoadingContext.mockReturnValue(true);
            User().hasEmail.mockReturnValue(true);
            const user = new FakeUser();
            const context = {
              user,
            };
            const callbackHandler = runScript().decisionsListener(context);
            const send = jest.fn();
            const unsubscribe = callbackHandler(send);
            unsubscribe();
            expect(
              Db().subscribeCollaboratorDecisions.mock.results[0].value
            ).toHaveBeenCalled();
          });
        });
      });
    });
  });
  describe("redirectResultListener", () => {
    it("should return a callback handler", () => {
      const callbackHandler = runScript().redirectResultListener();
      expect(callbackHandler).toEqual(expect.any(Function));
    });
    describe("callback handler", () => {
      it("should invoke getRedirectResult", () => {
        Auth().getRedirectResult.mockResolvedValue(undefined);
        const callbackHandler = runScript().redirectResultListener();
        const send = jest.fn();
        callbackHandler(send);
        expect(Auth().getRedirectResult).toHaveBeenCalled();
      });
      it("should update creator if operation was a link", (done) => {
        Auth().getRedirectResult.mockResolvedValue({
          operationType: "link",
          user: {
            email: "user@example.com",
            uid: "userId",
          },
        });
        const callbackHandler = runScript().redirectResultListener();
        callbackHandler(() => {
          expect(Db().updateCreator).toHaveBeenCalledWith({
            email: "user@example.com",
            id: "userId",
          });
          done();
        });
      });
      it("should send REDIRECTRESULT if getRedirectResult resolves", (done) => {
        Auth().getRedirectResult.mockResolvedValue(undefined);
        const callbackHandler = runScript().redirectResultListener();
        callbackHandler((event) => {
          expect(event).toEqual({ type: "REDIRECTRESULT" });
          done();
        });
      });
      it("should send ERROR if getRedirectResult rejects", (done) => {
        const error = new Error();
        Auth().getRedirectResult.mockRejectedValue(error);
        const callbackHandler = runScript().redirectResultListener();
        callbackHandler((event) => {
          expect(event).toEqual({ type: "ERROR", error });
          done();
        });
      });
    });
  });
  describe("urlListener", () => {
    it("should return a callback handler", () => {
      const callbackHandler = runScript().urlListener();
      expect(callbackHandler).toEqual(expect.any(Function));
    });
    describe("callbackHandler", () => {
      it("should send LOAD if pathname is a decision url", () => {
        jest
          .spyOn(window, "location", "get")
          .mockReturnValue({ pathname: "/decision/decisionId" } as Location);
        const callbackHandler = runScript().urlListener();
        const send = jest.fn();
        callbackHandler(send);
        expect(send).toHaveBeenCalledWith({
          type: "LOAD",
          decisionId: "decisionId",
        });
      });
      it("should send DECISIONS otherwise", () => {
        jest
          .spyOn(window, "location", "get")
          .mockReturnValue({ pathname: "/" } as Location);
        const callbackHandler = runScript().urlListener();
        const send = jest.fn();
        callbackHandler(send);
        expect(send).toHaveBeenCalledWith({ type: "DECISIONS" });
      });
      it("should return an unsubscribe function", () => {
        const unsub = () => undefined;
        History().historyListener.mockReturnValue(unsub);
        const callbackHandler = runScript().urlListener();
        const send = jest.fn();
        const result = callbackHandler(send);
        expect(History().historyListener).toHaveBeenCalledWith(
          expect.any(Function)
        );
        expect(result).toBe(unsub);
      });
    });
  });
  describe("userIdListener", () => {
    it("should return a callback handler", () => {
      const callbackHandler = runScript().userIdListener();
      expect(callbackHandler).toEqual(expect.any(Function));
    });
    describe("callback handler", () => {
      it("should listen for auth changes", () => {
        const callbackHandler = runScript().userIdListener();
        const send = jest.fn();
        callbackHandler(send);
        expect(Auth().authListener).toHaveBeenCalledWith(expect.any(Function));
      });
      it("should send SIGNIN if auth callback receives a 'user'", () => {
        const callbackHandler = runScript().userIdListener();
        const send = jest.fn();
        callbackHandler(send);
        const [callback] = Auth().authListener.mock.calls[0];
        const user = new FakeUser();
        callback(user);
        expect(send).toHaveBeenCalledWith({ type: "SIGNIN", user });
      });
      it("should send SIGNOUT if auth callback receives undefined", () => {
        const callbackHandler = runScript().userIdListener();
        const send = jest.fn();
        callbackHandler(send);
        const [callback] = Auth().authListener.mock.calls[0];
        callback(undefined);
        expect(send).toHaveBeenCalledWith({ type: "SIGNOUT" });
      });
      it("should return the auth unsubscribe function", () => {});
    });
  });
});
