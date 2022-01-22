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
    it("should set 'criteria' and 'criterion'", () => {
      runScript();
      expect(Xstate().assign).toHaveBeenCalledWith({
        criteria: expect.any(Function),
        criterion: expect.any(Function),
      });
    });
    it("should pick 'criteria' from CriteriaLoadedEvent", () => {
      const { setCriteria } = runScript();
      const criteria = [];
      expect(setCriteria.args[0].criteria({}, { criteria })).toBe(criteria);
    });
    it("should pick 'criterion' from context if its also in 'criteria'", () => {
      const { setCriteria } = runScript();
      runScript();
      const criterion = {};
      const criteria = [criterion];
      expect(setCriteria.args[0].criterion({ criterion }, { criteria })).toBe(
        criterion
      );
    });
    it("should pick 'criterion' from 'criteria' by default", () => {
      const { setCriteria } = runScript();
      runScript();
      const criterion = {};
      const criteria = [criterion];
      expect(setCriteria.args[0].criterion({}, { criteria })).toBe(criterion);
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
    it("should set 'ratings'", () => {
      runScript();
      expect(Xstate().assign).toHaveBeenCalledWith({
        ratings: expect.any(Function),
      });
    });
    it("should pick 'ratings' from RatingsLoadedEvent", () => {
      const { setRatings } = runScript();
      const ratings = [];
      expect(setRatings.args[0].ratings({}, { ratings })).toBe(ratings);
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

export {};
