import Mocks from "../mocks";

jest.unmock("../mocks");

const runScript = () => jest.requireActual("../../src/util/action");

const mocks = Mocks(__dirname, {
  assign: ["xstate"],
  modal: ["uikit"],
});

describe("actions", () => {
  beforeEach(() => jest.resetModules());
  describe("authError", () => {
    it("should alert", () => {
      const { authError } = runScript();
      authError();
      expect(mocks.modal.alert.mock.calls.length).toBe(1);
      expect(mocks.modal.alert.mock.calls[0]).toEqual([
        "Failed to link account. This probably means that you have already linked another guest account. Try signing in with your Google account.",
      ]);
    });
  });
  describe("clearDecision", () => {
    it("should be an assign action", () => {
      const { clearDecision } = runScript();
      expect(mocks.assign).nthReturnedWith(1, clearDecision);
    });
    it("should clear criteria, criterion, decision, options, and ratings", () => {
      runScript();
      expect(mocks.assign).nthCalledWith(1, {
        criteria: undefined,
        criterion: undefined,
        decision: undefined,
        options: undefined,
        ratings: undefined,
      });
    });
  });
  describe("clearUser", () => {
    it("should be an assign action", () => {
      const { clearUser } = runScript();
      expect(mocks.assign).nthReturnedWith(2, clearUser);
    });
    it("should clear 'user'", () => {
      runScript();
      expect(mocks.assign).nthCalledWith(2, {
        user: undefined,
      });
    });
  });
  describe("setCollaboratorDecisions", () => {
    it("should be an assign action", () => {
      const { setCollaboratorDecisions } = runScript();
      expect(mocks.assign).nthReturnedWith(3, setCollaboratorDecisions);
    });
    it("should set 'collaboratorDecisions'", () => {
      runScript();
      expect(mocks.assign).nthCalledWith(3, {
        collaboratorDecisions: expect.any(Function),
      });
    });
    it("should pick 'decisions' from CollaboratorDecisionsLoadedEvent", () => {
      runScript();
      const [assignment] = mocks.assign.mock.calls[2];
      const decisions = [];
      expect(assignment.collaboratorDecisions({}, { decisions })).toBe(
        decisions
      );
    });
  });
  describe("setCreatorDecisions", () => {
    it("should be an assign action", () => {
      const { setCreatorDecisions } = runScript();
      expect(mocks.assign).nthReturnedWith(4, setCreatorDecisions);
    });
    it("should set 'creatorDecisions'", () => {
      runScript();
      expect(mocks.assign).nthCalledWith(4, {
        creatorDecisions: expect.any(Function),
      });
    });
    it("should pick 'decisions' from CreatorDecisionsLoadedEvent", () => {
      runScript();
      const [assignment] = mocks.assign.mock.calls[3];
      const decisions = [];
      expect(assignment.creatorDecisions({}, { decisions })).toBe(decisions);
    });
  });
  describe("setCriteria", () => {
    it("should be an assign action", () => {
      const { setCriteria } = runScript();
      expect(mocks.assign).nthReturnedWith(5, setCriteria);
    });
    it("should set 'criteria' and 'criterion'", () => {
      runScript();
      expect(mocks.assign).nthCalledWith(5, {
        criteria: expect.any(Function),
        criterion: expect.any(Function),
      });
    });
    it("should pick 'criteria' from CriteriaLoadedEvent", () => {
      runScript();
      const [assignment] = mocks.assign.mock.calls[4];
      const criteria = [];
      expect(assignment.criteria({}, { criteria })).toBe(criteria);
    });
    it("should pick 'criterion' from context if its also in 'criteria'", () => {
      runScript();
      const [assignment] = mocks.assign.mock.calls[4];
      const criterion = {};
      const criteria = [criterion];
      expect(assignment.criterion({ criterion }, { criteria })).toBe(criterion);
    });
    it("should pick 'criterion' from 'criteria' by default", () => {
      runScript();
      const [assignment] = mocks.assign.mock.calls[4];
      const criterion = {};
      const criteria = [criterion];
      expect(assignment.criterion({}, { criteria })).toBe(criterion);
    });
  });
  describe("setCriterion", () => {
    it("should be an assign action", () => {
      const { setCriterion } = runScript();
      expect(mocks.assign).nthReturnedWith(6, setCriterion);
    });
    it("should set 'criterion'", () => {
      runScript();
      expect(mocks.assign).nthCalledWith(6, {
        criterion: expect.any(Function),
      });
    });
    it("should pick 'criterion' from CriterionEvent", () => {
      runScript();
      const [assignment] = mocks.assign.mock.calls[5];
      const criterion = {};
      expect(assignment.criterion({}, { criterion })).toBe(criterion);
    });
  });
  describe("setDecision", () => {
    it("should be an assign action", () => {
      const { setDecision } = runScript();
      expect(mocks.assign).nthReturnedWith(7, setDecision);
    });
    it("should set 'decision'", () => {
      runScript();
      expect(mocks.assign).nthCalledWith(7, {
        decision: expect.any(Function),
      });
    });
    it("should pick 'decision' from DecisionEvent", () => {
      runScript();
      const [assignment] = mocks.assign.mock.calls[6];
      const decision = {};
      expect(assignment.decision({}, { decision })).toBe(decision);
    });
  });
  describe("setError", () => {
    it("should be an assign action", () => {
      const { setError } = runScript();
      expect(mocks.assign).nthReturnedWith(8, setError);
    });
    it("should set 'error'", () => {
      runScript();
      expect(mocks.assign).nthCalledWith(8, {
        error: expect.any(Function),
      });
    });
    it("should pick 'error' from ErrorEvent", () => {
      runScript();
      const [assignment] = mocks.assign.mock.calls[7];
      const error = {};
      expect(assignment.error({}, { error })).toBe(error);
    });
  });
  describe("setOptions", () => {
    it("should be an assign action", () => {
      const { setOptions } = runScript();
      expect(mocks.assign).nthReturnedWith(9, setOptions);
    });
    it("should set 'options'", () => {
      runScript();
      expect(mocks.assign).nthCalledWith(9, {
        options: expect.any(Function),
      });
    });
    it("should pick 'options' from OptionsLoadedEvent", () => {
      runScript();
      const [assignment] = mocks.assign.mock.calls[8];
      const options = [];
      expect(assignment.options({}, { options })).toBe(options);
    });
  });
  describe("setRatings", () => {
    it("should be an assign action", () => {
      const { setRatings } = runScript();
      expect(mocks.assign).nthReturnedWith(10, setRatings);
    });
    it("should set 'ratings'", () => {
      runScript();
      expect(mocks.assign).nthCalledWith(10, {
        ratings: expect.any(Function),
      });
    });
    it("should pick 'ratings' from RatingsLoadedEvent", () => {
      runScript();
      const [assignment] = mocks.assign.mock.calls[9];
      const ratings = [];
      expect(assignment.ratings({}, { ratings })).toBe(ratings);
    });
  });
  describe("setUser", () => {
    it("should be an assign action", () => {
      const { setUser } = runScript();
      expect(mocks.assign).nthReturnedWith(11, setUser);
    });
    it("should set 'user'", () => {
      runScript();
      expect(mocks.assign).nthCalledWith(11, {
        user: expect.any(Function),
      });
    });
    it("should pick 'user' from SigninEvent", () => {
      runScript();
      const [assignment] = mocks.assign.mock.calls[10];
      const user = {};
      expect(assignment.user({}, { user })).toBe(user);
    });
  });
});
