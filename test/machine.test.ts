const Actions = () => jest.requireMock("../src/util/action");
const Auth = () => jest.requireMock("../src/service/auth");
const Guards = () => jest.requireMock("../src/util/guard");
const Services = () => jest.requireMock("../src/util/service");
const Svelte_store = () => jest.requireMock("svelte/store");
const Xstate = () => jest.requireMock("xstate");

const runScript = () => jest.requireActual("../src/machine");

describe("machine", () => {
  beforeEach(() => jest.resetModules());
  it("should create a state machine", () => {
    runScript();
    expect(Xstate().createMachine).toHaveBeenCalledWith({
      initial: "initial",
      context: {},
      on: {
        ERROR: {
          actions: Actions().setError,
        },
      },
      always: {
        target: "error",
        cond: Guards().enterError,
      },
      states: {
        error: {},
        initial: {
          invoke: {
            src: Auth().getRedirectResult,
            onDone: "root",
            onError: {
              target: "root",
              actions: Actions().authError,
            },
          },
        },
        root: {
          initial: "loading",
          invoke: {
            src: Services().userIdListener,
          },
          states: {
            loading: {},
            signedIn: {
              initial: "decisions",
              states: {
                decisions: {
                  invoke: {
                    src: Services().decisionsListener,
                  },
                },
                decision: {
                  initial: "options",
                  invoke: {
                    src: Services().decisionListener,
                  },
                  on: {
                    OPTIONS: {
                      target: ".options",
                    },
                    OPTIONSLOADED: {
                      actions: Actions().setOptions,
                    },
                    CRITERIA: {
                      target: ".criteria",
                      cond: Guards().enoughOptions,
                    },
                    CRITERIALOADED: {
                      actions: Actions().setCriteria,
                    },
                    RATINGS: {
                      target: ".ratings",
                      cond: Guards().enoughCriteria,
                    },
                    CRITERION: {
                      cond: Guards().doneRatingCurrent,
                      actions: Actions().setCriterion,
                    },
                    RATINGSLOADED: {
                      actions: Actions().setRatings,
                    },
                    COLLABORATORS: {
                      target: ".collaborators",
                      cond: Guards().doneRating,
                    },
                    RESULTS: {
                      target: ".results",
                      cond: Guards().doneRating,
                    },
                  },
                  states: {
                    options: {},
                    criteria: {},
                    ratings: {},
                    collaborators: {},
                    results: {},
                  },
                },
              },
              on: {
                DECISIONS: {
                  target: ".decisions",
                  actions: Actions().clearDecision,
                },
                DECISION: {
                  target: ".decision",
                  actions: Actions().setDecision,
                },
                COLLABORATORDECISIONSLOADED: {
                  actions: Actions().setCollaboratorDecisions,
                },
                CREATORDECISIONSLOADED: {
                  actions: Actions().setCreatorDecisions,
                },
              },
            },
            signedOut: {},
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
      },
    });
  });
  it("should create an interpreter instance", () => {
    const machine = {};
    Xstate().createMachine.mockReturnValue(machine);
    runScript();
    expect(Xstate().interpret).toHaveBeenCalledWith(machine);
  });
  it("should start the interpreter", () => {
    const interpreter = {
      send: jest.fn(),
      start: jest.fn(() => interpreter),
      state: {},
    };
    Xstate().interpret.mockReturnValue(interpreter);
    runScript();
    expect(interpreter.start).toHaveBeenCalled();
  });
  it("should wrap the interpreter state in a readable", () => {
    const interpreter = {
      send: jest.fn(),
      start: jest.fn(() => interpreter),
      state: {},
    };
    Xstate().interpret.mockReturnValue(interpreter);
    runScript();
    expect(Svelte_store().readable).toHaveBeenCalledWith(
      interpreter.state,
      expect.any(Function)
    );
  });
  it("should update the readable on state transitions", () => {
    const interpreter = {
      onTransition: jest.fn(),
      send: jest.fn(),
      start: jest.fn(() => interpreter),
      state: {},
    };
    Xstate().interpret.mockReturnValue(interpreter);
    runScript();
    const [, start] = Svelte_store().readable.mock.calls[0];
    const set = jest.fn();
    start(set);
    const [listener] = interpreter.onTransition.mock.calls[0];
    const state = {};
    listener(state);
    expect(set).toHaveBeenCalledWith(state);
  });
  it("should export the state readable", () => {
    const interpreter = {
      send: jest.fn(),
      start: jest.fn(() => interpreter),
      state: {},
    };
    Xstate().interpret.mockReturnValue(interpreter);
    const readable = {};
    Svelte_store().readable.mockReturnValue(readable);
    const { state } = runScript();
    expect(state).toBe(readable);
  });
  it("should export the interpreter send function", () => {
    const interpreter = {
      send: jest.fn(),
      start: jest.fn(() => interpreter),
      state: {},
    };
    Xstate().interpret.mockReturnValue(interpreter);
    const { send } = runScript();
    expect(send).toBe(interpreter.send);
  });
});

export {};
