import Mocks from "../mocks";
import { FakeDecision, FakeUser } from "../fake";

jest.unmock("../mocks");

const mocks = Mocks(__dirname, {
  authListener: ["../../src/service/auth"],
  hasEmail: ["../../src/util/user"],
  isDecisionContext: ["../../src/util/context"],
  isSignedinContext: ["../../src/util/context"],
  subscribeCollaboratorDecisions: ["../../src/service/db"],
  subscribeCreatorDecisions: ["../../src/service/db"],
  subscribeCriteria: ["../../src/service/db"],
  subscribeOptions: ["../../src/service/db"],
  subscribeRatings: ["../../src/service/db"],
});

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
        mocks.isDecisionContext.mockReturnValue(false);
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
        mocks.isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(mocks.subscribeOptions).toHaveBeenCalledWith(
          decision.id,
          expect.any(Function)
        );
      });
      it("should send OPTIONSLOADED when options change", () => {
        mocks.isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = mocks.subscribeOptions.mock.calls[0];
        const options = [];
        callback(options);
        expect(send).toHaveBeenCalledWith({ type: "OPTIONSLOADED", options });
      });
      it("should subscribe to criteria", () => {
        mocks.isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(mocks.subscribeCriteria).toHaveBeenCalledWith(
          decision.id,
          expect.any(Function)
        );
      });
      it("should send CRITERIALOADED when criteria change", () => {
        mocks.isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = mocks.subscribeCriteria.mock.calls[0];
        const criteria = [];
        callback(criteria);
        expect(send).toHaveBeenCalledWith({ type: "CRITERIALOADED", criteria });
      });
      it("should subscribe to ratings", () => {
        mocks.isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(mocks.subscribeRatings).toHaveBeenCalledWith(
          decision.id,
          expect.any(Function)
        );
      });
      it("should send RATINGSLOADED when ratings change", () => {
        mocks.isDecisionContext.mockReturnValue(true);
        const decision = new FakeDecision();
        const context = {
          decision,
        };
        const callbackHandler = runScript().decisionListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = mocks.subscribeRatings.mock.calls[0];
        const ratings = [];
        callback(ratings);
        expect(send).toHaveBeenCalledWith({ type: "RATINGSLOADED", ratings });
      });
      it("should return an unsubscribe function", () => {
        mocks.isDecisionContext.mockReturnValue(true);
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
          mocks.subscribeCriteria.mockReturnValue(jest.fn());
          mocks.subscribeOptions.mockReturnValue(jest.fn());
          mocks.subscribeRatings.mockReturnValue(jest.fn());
        });
        it("should unsubscribe from options changes", () => {
          mocks.isDecisionContext.mockReturnValue(true);
          const decision = new FakeDecision();
          const context = {
            decision,
          };
          const callbackHandler = runScript().decisionListener(context);
          const send = jest.fn();
          const unsubscribe = callbackHandler(send);
          unsubscribe();
          expect(
            mocks.subscribeOptions.mock.results[0].value
          ).toHaveBeenCalled();
        });
        it("should unsubscribe from criteria changes", () => {
          mocks.isDecisionContext.mockReturnValue(true);
          const decision = new FakeDecision();
          const context = {
            decision,
          };
          const callbackHandler = runScript().decisionListener(context);
          const send = jest.fn();
          const unsubscribe = callbackHandler(send);
          unsubscribe();
          expect(
            mocks.subscribeCriteria.mock.results[0].value
          ).toHaveBeenCalled();
        });
        it("should unsubscribe from ratings changes", () => {
          mocks.isDecisionContext.mockReturnValue(true);
          const decision = new FakeDecision();
          const context = {
            decision,
          };
          const callbackHandler = runScript().decisionListener(context);
          const send = jest.fn();
          const unsubscribe = callbackHandler(send);
          unsubscribe();
          expect(
            mocks.subscribeRatings.mock.results[0].value
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
        mocks.isSignedinContext.mockReturnValue(false);
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
        mocks.isSignedinContext.mockReturnValue(true);
        const user = new FakeUser();
        const context = {
          user,
        };
        const callbackHandler = runScript().decisionsListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(mocks.subscribeCreatorDecisions).toHaveBeenCalledWith(
          user,
          expect.any(Function)
        );
      });
      it("should send CREATORDECISIONSLOADED when decisions change", () => {
        mocks.isSignedinContext.mockReturnValue(true);
        const user = new FakeUser();
        const context = {
          user,
        };
        const callbackHandler = runScript().decisionsListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = mocks.subscribeCreatorDecisions.mock.calls[0];
        const decisions = [];
        callback(decisions);
        expect(send).toHaveBeenCalledWith({
          type: "CREATORDECISIONSLOADED",
          decisions,
        });
      });
      it("should return the creator decisions unsubscribe function is user does not have an email", () => {
        mocks.isSignedinContext.mockReturnValue(true);
        mocks.hasEmail.mockReturnValue(false);
        const user = new FakeUser();
        const context = {
          user,
        };
        const unsubscribe = () => undefined;
        mocks.subscribeCreatorDecisions.mockReturnValue(unsubscribe);
        const callbackHandler = runScript().decisionsListener(context);
        const send = jest.fn();
        expect(callbackHandler(send)).toBe(unsubscribe);
      });
      it("should subscribe to collaborator decisions", () => {
        mocks.isSignedinContext.mockReturnValue(true);
        mocks.hasEmail.mockReturnValue(true);
        const user = new FakeUser();
        const context = {
          user,
        };
        const callbackHandler = runScript().decisionsListener(context);
        const send = jest.fn();
        callbackHandler(send);
        expect(mocks.subscribeCollaboratorDecisions).toHaveBeenCalledWith(
          user,
          expect.any(Function)
        );
      });
      it("should send COLLABORATORDECISIONSLOADED when decisions change", () => {
        mocks.isSignedinContext.mockReturnValue(true);
        mocks.hasEmail.mockReturnValue(true);
        const user = new FakeUser();
        const context = {
          user,
        };
        const callbackHandler = runScript().decisionsListener(context);
        const send = jest.fn();
        callbackHandler(send);
        const [, callback] = mocks.subscribeCollaboratorDecisions.mock.calls[0];
        const decisions = [];
        callback(decisions);
        expect(send).toHaveBeenCalledWith({
          type: "COLLABORATORDECISIONSLOADED",
          decisions,
        });
      });
      it("should return an unsubscribe function", () => {
        mocks.isSignedinContext.mockReturnValue(true);
        mocks.hasEmail.mockReturnValue(true);
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
          mocks.subscribeCreatorDecisions.mockReturnValue(jest.fn());
          mocks.subscribeCollaboratorDecisions.mockReturnValue(jest.fn());
        });
        it("should unsubscribe from creator decision changes", () => {
          mocks.isSignedinContext.mockReturnValue(true);
          mocks.hasEmail.mockReturnValue(true);
          const user = new FakeUser();
          const context = {
            user,
          };
          const callbackHandler = runScript().decisionsListener(context);
          const send = jest.fn();
          const unsubscribe = callbackHandler(send);
          unsubscribe();
          expect(
            mocks.subscribeCreatorDecisions.mock.results[0].value
          ).toHaveBeenCalled();
        });
        it("should unsubscribe from collaborator decision changes", () => {
          mocks.isSignedinContext.mockReturnValue(true);
          mocks.hasEmail.mockReturnValue(true);
          const user = new FakeUser();
          const context = {
            user,
          };
          const callbackHandler = runScript().decisionsListener(context);
          const send = jest.fn();
          const unsubscribe = callbackHandler(send);
          unsubscribe();
          expect(
            mocks.subscribeCollaboratorDecisions.mock.results[0].value
          ).toHaveBeenCalled();
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
        expect(mocks.authListener).toHaveBeenCalledWith(expect.any(Function));
      });
      it("should send SIGNIN if auth callback receives a 'user'", () => {
        const callbackHandler = runScript().userIdListener();
        const send = jest.fn();
        callbackHandler(send);
        const [callback] = mocks.authListener.mock.calls[0];
        const user = new FakeUser();
        callback(user);
        expect(send).toHaveBeenCalledWith({ type: "SIGNIN", user });
      });
      it("should send SIGNOUT if auth callback receives undefined", () => {
        const callbackHandler = runScript().userIdListener();
        const send = jest.fn();
        callbackHandler(send);
        const [callback] = mocks.authListener.mock.calls[0];
        callback(undefined);
        expect(send).toHaveBeenCalledWith({ type: "SIGNOUT" });
      });
      it("should return the auth unsubscribe function", () => {});
    });
  });
});
