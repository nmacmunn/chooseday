const Actions = () => jest.requireMock("../src/util/action");
const Auth = () => jest.requireMock("../src/service/auth");
const Guards = () => jest.requireMock("../src/util/guard");
const Services = () => jest.requireMock("../src/util/service");
const Svelte_store = () => jest.requireMock("svelte/store");
const Xstate = () => require("xstate");

const runScript = () => jest.requireActual("../src/machine");

jest.unmock("xstate");

describe("machine", () => {
  beforeEach(() => jest.resetModules());
  it("should create a state machine", () => {
    const createMachine = jest.spyOn(Xstate(), "createMachine");
    runScript();
    expect(createMachine).toHaveBeenCalledWith({
      always: {
        cond: Guards().enterError,
        target: "error",
      },
      context: {},
      initial: "preAuth",
      on: {
        ERROR: {
          actions: Actions().setError,
        },
      },
      states: {
        auth: {
          initial: "signingIn",
          invoke: {
            src: Services().userIdListener,
          },
          states: {
            signedIn: {
              initial: "decisions",
              states: {
                decisions: {
                  initial: "loading",
                  invoke: {
                    src: Services().decisionsListener,
                  },
                  on: {
                    COLLABORATORDECISIONSLOADED: {
                      actions: Actions().setCollaboratorDecisions,
                    },
                    CREATING: {
                      actions: Actions().setDecisionId,
                      target: ".creating",
                    },
                    CREATORDECISIONSLOADED: {
                      actions: Actions().setCreatorDecisions,
                    },
                    DECISION: {
                      actions: Actions().setDecision,
                      target: "decision",
                    },
                  },
                  states: {
                    creating: {},
                    loaded: {},
                    loading: {
                      always: {
                        cond: Guards().decisionsLoaded,
                        target: "loaded",
                      },
                    },
                  },
                },
                decision: {
                  initial: "loading",
                  invoke: {
                    src: Services().decisionListener,
                  },
                  on: {
                    CRITERIALOADED: {
                      actions: Actions().setCriteria,
                    },
                    OPTIONSLOADED: {
                      actions: Actions().setOptions,
                    },
                    RATINGSLOADED: {
                      actions: Actions().setRatings,
                    },
                  },
                  states: {
                    loaded: {
                      initial: "options",
                      on: {
                        COLLABORATORS: {
                          cond: Guards().doneRating,
                          target: ".collaborators",
                        },
                        CRITERIA: {
                          cond: Guards().enoughOptions,
                          target: ".criteria",
                        },
                        CRITERION: {
                          cond: Guards().doneRatingCurrent,
                          actions: Actions().setCriterion,
                        },
                        OPTIONS: {
                          target: ".options",
                        },
                        RATINGS: {
                          cond: Guards().enoughCriteria,
                          target: ".ratings",
                        },
                        RESULTS: {
                          cond: Guards().doneRating,
                          target: ".results",
                        },
                      },
                      states: {
                        collaborators: {},
                        criteria: {},
                        options: {},
                        ratings: {},
                        results: {},
                      },
                    },
                    loading: {
                      always: {
                        cond: Guards().decisionLoaded,
                        target: "loaded",
                      },
                    },
                  },
                },
              },
              on: {
                DECISIONS: {
                  target: ".decisions",
                  actions: Actions().clearDecision,
                },
              },
            },
            signedOut: {},
            signingIn: {},
          },
          on: {
            SIGNIN: {
              target: ".signedIn",
              actions: Actions().setUser,
            },
            SIGNOUT: {
              target: ".signedOut",
              actions: Actions().clearUser,
            },
          },
        },
        error: {},
        preAuth: {
          invoke: {
            src: Services().redirectResultListener,
          },
          on: {
            REDIRECTRESULT: "auth",
          },
        },
      },
    });
  });
  it("should create an interpreter instance", () => {
    const createMachine = jest.spyOn(Xstate(), "createMachine");
    const interpret = jest.spyOn(Xstate(), "interpret");
    runScript();
    expect(interpret).toHaveBeenCalledWith(createMachine.mock.results[0].value);
  });
  it("should start the interpreter", () => {
    const interpret = jest.spyOn(Xstate(), "interpret");
    runScript();
    const interpreter = interpret.mock.results[0].value;
    expect(interpreter.status).toBe(Xstate().InterpreterStatus.Running);
  });
  it("should wrap the interpreter state in a readable", () => {
    const interpret = jest.spyOn(Xstate(), "interpret");
    runScript();
    const interpreter = interpret.mock.results[0].value;
    expect(Svelte_store().readable).toHaveBeenCalledWith(
      interpreter.state,
      expect.any(Function)
    );
  });
  it("should update the readable on state transitions", () => {
    const interpret = jest.spyOn(Xstate(), "interpret");
    runScript();
    const interpreter = interpret.mock.results[0].value;
    const [, start] = Svelte_store().readable.mock.calls[0];
    const set = jest.fn();
    start(set);
    expect(set).toHaveBeenCalledWith(interpreter.state);
  });
  it("should export the state readable", () => {
    const readable = {};
    Svelte_store().readable.mockReturnValue(readable);
    const { state } = runScript();
    expect(state).toBe(readable);
  });
  it("should export the interpreter send function", () => {
    const interpret = jest.spyOn(Xstate(), "interpret");
    const { send } = runScript();
    const interpreter = interpret.mock.results[0].value;
    expect(send).toBe(interpreter.send);
  });
});

export {};
