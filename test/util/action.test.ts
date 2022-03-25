import { FakeCriterion, FakeRating, FakeUser } from "../helpers/fake";

jest.unmock("lodash");
jest.unmock("../helpers/fake");

const History = () => jest.requireMock("../../src/util/history");
const ResultUtil = () => jest.requireMock("../../src/util/result");
const StateValue = () => jest.requireMock("../../src/util/state-value");
const Xstate = () => jest.requireMock("xstate");
const runScript = () => jest.requireActual("../../src/util/action");

describe("actions", () => {
  beforeEach(() => {
    jest.resetModules();
    Xstate().assign.mockImplementation((...args) => ({ args }));
  });
  describe("clearDecision", () => {
    it("should be an assign action", () => {
      const { clearDecision } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(clearDecision);
    });
    it("should clear criteria, criterion, decision, options, and ratings", () => {
      runScript();
      expect(Xstate().assign).toHaveBeenCalledWith({
        criteria: undefined,
        criterion: undefined,
        decision: undefined,
        options: undefined,
        ratings: undefined,
      });
    });
  });
  describe("clearError", () => {
    it("should be an assign action", () => {
      const { clearError } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(clearError);
    });
    it("should de defined by an assignment function", () => {
      const { clearError } = runScript();
      const [assigner] = clearError.args;
      expect(Xstate().assign).toHaveBeenCalledWith(assigner);
    });
    it("should push history", () => {
      const { clearError } = runScript();
      const [assigner] = clearError.args;
      assigner.error();
      expect(History().pushHistory).toHaveBeenCalledWith("/decisions");
    });
    it("should clear 'error'", () => {
      const { clearError } = runScript();
      const [assigner] = clearError.args;
      expect(assigner.error()).not.toBeDefined;
    });
  });
  describe("clearUser", () => {
    it("should be an assign action", () => {
      const { clearUser } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(clearUser);
    });
    it("should clear 'user'", () => {
      runScript();
      expect(Xstate().assign).toHaveBeenCalledWith({ user: undefined });
    });
  });
  describe("pushUrl", () => {
    it("should push /decisions if state matches decisionsLoaded", () => {
      const context = {};
      const event = {};
      const meta = {
        state: {
          matches: (value) => value === StateValue().stateValue.decisionsLoaded,
        },
      };
      runScript().pushUrl(context, event, meta);
      expect(History().pushHistory).toHaveBeenCalledWith("/decisions");
    });
    it("should push /decision/decisionId if state matches decisionLoaded", () => {
      const context = {
        decisionId: "decisionId",
        decision: { title: "title" },
      };
      const event = {};
      const meta = {
        state: {
          matches: (value) => value === StateValue().stateValue.decisionLoaded,
        },
      };
      runScript().pushUrl(context, event, meta);
      expect(History().pushHistory).toHaveBeenCalledWith(
        "/decision/decisionId"
      );
    });
  });
  describe("setCollaboratorDecisions", () => {
    it("should be an assign action", () => {
      const { setCollaboratorDecisions } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(setCollaboratorDecisions);
    });
    it("should set 'collaboratorDecisions'", () => {
      runScript();
      expect(Xstate().assign).toHaveBeenCalledWith({
        collaboratorDecisions: expect.any(Function),
      });
    });
    it("should pick 'decisions' from CollaboratorDecisionsLoadedEvent", () => {
      const { setCollaboratorDecisions } = runScript();
      const decisions = [];
      expect(
        setCollaboratorDecisions.args[0].collaboratorDecisions(
          {},
          { decisions }
        )
      ).toBe(decisions);
    });
  });
  describe("setCreatorDecisions", () => {
    it("should be an assign action", () => {
      const { setCreatorDecisions } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(setCreatorDecisions);
    });
    it("should set 'creatorDecisions'", () => {
      runScript();
      expect(Xstate().assign).toHaveBeenCalledWith({
        creatorDecisions: expect.any(Function),
      });
    });
    it("should pick 'decisions' from CreatorDecisionsLoadedEvent", () => {
      const { setCreatorDecisions } = runScript();
      const decisions = [];
      expect(
        setCreatorDecisions.args[0].creatorDecisions({}, { decisions })
      ).toBe(decisions);
    });
  });
  describe("setCriteria", () => {
    it("should be an assign action", () => {
      const { setCriteria } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(setCriteria);
    });
    it("should de defined by an assignment function", () => {
      const { setCriteria } = runScript();
      const [assigner] = setCriteria.args;
      expect(Xstate().assign).toHaveBeenCalledWith(assigner);
    });
    it("should pick 'criteria' from the event", () => {
      const { setCriteria } = runScript();
      const [assigner] = setCriteria.args;
      const context = {};
      const criteria = [];
      const event = { criteria };
      expect(assigner(context, event).criteria).toBe(criteria);
    });
    it("should assign a result instance", () => {
      const result = {};
      ResultUtil().getResult.mockReturnValue(result);
      const { setCriteria } = runScript();
      const [assigner] = setCriteria.args;
      const context = {
        user: new FakeUser(),
      };
      const criteria = [new FakeCriterion(), new FakeCriterion()];
      const event = { criteria };
      expect(assigner(context, event).result).toEqual(result);
      expect(ResultUtil().getResult).toHaveBeenCalledWith({
        ...context,
        criteria,
        criterion: criteria[0],
        userCriteria: criteria,
      });
    });
    it("should filter 'criteria' to get 'userCriteria'", () => {
      const { setCriteria } = runScript();
      const [assigner] = setCriteria.args;
      const context = {
        user: new FakeUser(),
      };
      const criteria = [
        new FakeCriterion(),
        new FakeCriterion({ user: new FakeUser({ id: "otherguy" }) }),
      ];
      const event = { criteria };
      expect(assigner(context, event).userCriteria).toEqual([criteria[0]]);
    });
    it("should pick 'criterion' from context if its in 'criteria'", () => {
      const { setCriteria } = runScript();
      const [assigner] = setCriteria.args;
      const criterion = new FakeCriterion();
      const context = {
        criterion,
        user: new FakeUser(),
      };
      const criteria = [criterion];
      const event = { criteria };
      expect(assigner(context, event).criterion).toBe(criterion);
    });
    it("should pick 'criterion' from context if its in 'criteria'", () => {
      const { setCriteria } = runScript();
      const [assigner] = setCriteria.args;
      const criterion = new FakeCriterion();
      const context = {
        criterion,
        user: new FakeUser(),
      };
      const criteria = [new FakeCriterion()];
      const event = { criteria };
      expect(assigner(context, event).criterion).toBe(criteria[0]);
    });
  });
  describe("setCriterion", () => {
    it("should be an assign action", () => {
      const { setCriterion } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(setCriterion);
    });
    it("should set 'criterion'", () => {
      runScript();
      expect(Xstate().assign).toHaveBeenCalledWith({
        criterion: expect.any(Function),
      });
    });
    it("should pick 'criterion' from CriterionEvent", () => {
      const { setCriterion } = runScript();
      const criterion = {};
      expect(setCriterion.args[0].criterion({}, { criterion })).toBe(criterion);
    });
  });
  describe("setDecision", () => {
    it("should be an assign action", () => {
      const { setDecision } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(setDecision);
    });
    it("should set 'decision'", () => {
      runScript();
      expect(Xstate().assign).toHaveBeenCalledWith({
        decision: expect.any(Function),
      });
    });
    it("should pick 'decision' from DecisionEvent", () => {
      const { setDecision } = runScript();
      const decision = {};
      expect(setDecision.args[0].decision({}, { decision })).toBe(decision);
    });
  });
  describe("setError", () => {
    it("should be an assign action", () => {
      const { setError } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(setError);
    });
    it("should set 'error'", () => {
      runScript();
      expect(Xstate().assign).toHaveBeenCalledWith({
        error: expect.any(Function),
      });
    });
    it("should pick 'error' from ErrorEvent", () => {
      const { setError } = runScript();
      const error = {};
      expect(setError.args[0].error({}, { error })).toBe(error);
    });
  });
  describe("setOptions", () => {
    it("should be an assign action", () => {
      const { setOptions } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(setOptions);
    });
    it("should set 'options'", () => {
      runScript();
      expect(Xstate().assign).toHaveBeenCalledWith({
        options: expect.any(Function),
      });
    });
    it("should pick 'options' from OptionsLoadedEvent", () => {
      const { setOptions } = runScript();
      const options = [];
      expect(setOptions.args[0].options({}, { options })).toBe(options);
    });
  });
  describe("setRatings", () => {
    it("should be an assign action", () => {
      const { setRatings } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(setRatings);
    });
    it("should de defined by an assignment function", () => {
      const { setRatings } = runScript();
      const [assigner] = setRatings.args;
      expect(Xstate().assign).toHaveBeenCalledWith(assigner);
    });
    it("should pick 'ratings' from the event", () => {
      const { setRatings } = runScript();
      const [assigner] = setRatings.args;
      const context = {
        user: new FakeUser(),
      };
      const ratings = [];
      const event = { ratings };
      expect(assigner(context, event).ratings).toBe(ratings);
    });
    it("should assign a result instance", () => {
      const result = {};
      ResultUtil().getResult.mockReturnValue(result);
      const { setRatings } = runScript();
      const [assigner] = setRatings.args;
      const context = {
        user: new FakeUser(),
      };
      const ratings = [new FakeRating(), new FakeRating()];
      const event = { ratings };
      expect(assigner(context, event).result).toEqual(result);
      expect(ResultUtil().getResult).toHaveBeenCalledWith({
        ...context,
        ratings,
        userRatings: ratings,
      });
    });
    it("should get 'userRatings' by filtering 'ratings'", () => {
      const { setRatings } = runScript();
      const [assigner] = setRatings.args;
      const context = {
        user: new FakeUser(),
      };
      const ratings = [
        new FakeRating(),
        new FakeRating({ user: new FakeUser({ id: "otherguy" }) }),
      ];
      const event = { ratings };
      expect(assigner(context, event).userRatings).toEqual([ratings[0]]);
    });
  });
  describe("setUser", () => {
    it("should be an assign action", () => {
      const { setUser } = runScript();
      expect(Xstate().assign).toHaveReturnedWith(setUser);
    });
    it("should set 'user'", () => {
      runScript();
      expect(Xstate().assign).toHaveBeenCalledWith({
        user: expect.any(Function),
      });
    });
    it("should pick 'user' from SigninEvent", () => {
      const { setUser } = runScript();
      const user = {};
      expect(setUser.args[0].user({}, { user })).toBe(user);
    });
  });
});
