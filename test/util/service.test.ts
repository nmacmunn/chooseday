import { FakeDecision, FakeUser } from "../helpers/fake";
jest.unmock("../helpers/fake");

const Auth = () => jest.requireMock("../../src/service/auth");
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
        Context().isDecisionContext.mockReturnValue(false);
        const context = {};
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(send).toHaveBeenCalledWith({
          type: "ERROR",
          error: "Failed to load decision",
        });
      });
      it("should subscribe to options", () => {
        Context().isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(Db().subscribeOptions).toHaveBeenCalledWith(
          decision.id,
          expect.any(Function)
        );
      });
      it("should send OPTIONSLOADED when options change", () => {
        Context().isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
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
        Context().isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(Db().subscribeCriteria).toHaveBeenCalledWith(
          decision.id,
          expect.any(Function)
        );
      });
      it("should send CRITERIALOADED when criteria change", () => {
        Context().isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
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
        Context().isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(Db().subscribeRatings).toHaveBeenCalledWith(
          decision.id,
          expect.any(Function)
        );
      });
      it("should send RATINGSLOADED when ratings change", () => {
        Context().isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
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
        Context().isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        const unsubscribe = callbackHandler(send);
        expect(unsubscribe).toEqual(expect.any(Function));
      });
      describe("unsubscribe", () => {
        beforeEach(() => {
          Db().subscribeCriteria.mockReturnValue(jest.fn());
          Db().subscribeOptions.mockReturnValue(jest.fn());
          Db().subscribeRatings.mockReturnValue(jest.fn());
        });
        it("should unsubscribe from options changes", () => {
          Context().isDecisionContext.mockReturnValue(true);
          const decision = new FakeDecision();
          const context = {
            decision,
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
          Context().isDecisionContext.mockReturnValue(true);
          const decision = new FakeDecision();
          const context = {
            decision,
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
          Context().isDecisionContext.mockReturnValue(true);
          const decision = new FakeDecision();
          const context = {
            decision,
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
        Context().isSignedinContext.mockReturnValue(false);
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
        Context().isSignedinContext.mockReturnValue(true);
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
        Context().isSignedinContext.mockReturnValue(true);
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
          Context().isSignedinContext.mockReturnValue(true);
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
          Context().isSignedinContext.mockReturnValue(true);
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
          Context().isSignedinContext.mockReturnValue(true);
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
          Context().isSignedinContext.mockReturnValue(true);
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
          Context().isSignedinContext.mockReturnValue(true);
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
            Context().isSignedinContext.mockReturnValue(true);
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
            Context().isSignedinContext.mockReturnValue(true);
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
  describe("userIdListener", () => {
    it("should return a callback handler", () => {
      const { userIdListener } = runScript();
      expect(userIdListener({})).toEqual(expect.any(Function));
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
