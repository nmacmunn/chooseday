import Mocks from "./mocks";

jest.unmock("./mocks");

const mocks = Mocks(__dirname, {
  authError: ["../src/util/action"],
  clearDecision: ["../src/util/action"],
  clearUser: ["../src/util/action"],
  createMachine: ["xstate"],
  decisionListener: ["../src/util/service"],
  decisionsListener: ["../src/util/service"],
  doneRating: ["../src/util/guard"],
  doneRatingCurrent: ["../src/util/guard"],
  enoughCriteria: ["../src/util/guard"],
  enoughOptions: ["../src/util/guard"],
  enterError: ["../src/util/guard"],
  getRedirectResult: ["../src/service/auth"],
  interpret: ["xstate"],
  readable: ["svelte/store"],
  setCollaboratorDecisions: ["../src/util/action"],
  setCreatorDecisions: ["../src/util/action"],
  setCriteria: ["../src/util/action"],
  setCriterion: ["../src/util/action"],
  setDecision: ["../src/util/action"],
  setError: ["../src/util/action"],
  setOptions: ["../src/util/action"],
  setRatings: ["../src/util/action"],
  setUser: ["../src/util/action"],
  userIdListener: ["../src/util/service"],
});

const runScript = () => jest.requireActual("../src/machine");

describe("machine", () => {
  beforeEach(() => jest.resetModules());
  it("should create a state machine", () => {
    runScript();
    expect(mocks.createMachine).toHaveBeenCalledWith({
      initial: "initial",
      context: {},
      on: {
        ERROR: {
          actions: mocks.setError,
        },
      },
      always: {
        target: "error",
        cond: mocks.enterError,
      },
      states: {
        error: {},
        initial: {
          invoke: {
            src: mocks.getRedirectResult,
            onDone: "root",
            onError: {
              target: "root",
              actions: mocks.authError,
            },
          },
        },
        root: {
          initial: "loading",
          invoke: {
            src: mocks.userIdListener,
          },
          states: {
            loading: {},
            signedIn: {
              initial: "decisions",
              states: {
                decisions: {
                  invoke: {
                    src: mocks.decisionsListener,
                  },
                },
                decision: {
                  initial: "options",
                  invoke: {
                    src: mocks.decisionListener,
                  },
                  on: {
                    OPTIONS: {
                      target: ".options",
                    },
                    OPTIONSLOADED: {
                      actions: mocks.setOptions,
                    },
                    CRITERIA: {
                      target: ".criteria",
                      cond: mocks.enoughOptions,
                    },
                    CRITERIALOADED: {
                      actions: mocks.setCriteria,
                    },
                    RATINGS: {
                      target: ".ratings",
                      cond: mocks.enoughCriteria,
                    },
                    CRITERION: {
                      cond: mocks.doneRatingCurrent,
                      actions: mocks.setCriterion,
                    },
                    RATINGSLOADED: {
                      actions: mocks.setRatings,
                    },
                    COLLABORATORS: {
                      target: ".collaborators",
                      cond: mocks.doneRating,
                    },
                    RESULTS: {
                      target: ".results",
                      cond: mocks.doneRating,
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
                  actions: mocks.clearDecision,
                },
                DECISION: {
                  target: ".decision",
                  actions: mocks.setDecision,
                },
                COLLABORATORDECISIONSLOADED: {
                  actions: mocks.setCollaboratorDecisions,
                },
                CREATORDECISIONSLOADED: {
                  actions: mocks.setCreatorDecisions,
                },
              },
            },
            signedOut: {},
          },
          on: {
            SIGNIN: {
              target: ".signedIn",
              actions: mocks.setUser,
            },
            SIGNOUT: {
              target: ".signedOut",
              actions: mocks.clearUser,
            },
          },
        },
      },
    });
  });
  it("should create an interpreter instance", () => {
    const machine = {};
    mocks.createMachine.mockReturnValue(machine);
    runScript();
    expect(mocks.interpret).toHaveBeenCalledWith(machine);
  });
  it("should start the interpreter", () => {
    const interpreter = {
      send: jest.fn(),
      start: jest.fn(() => interpreter),
      state: {},
    };
    mocks.interpret.mockReturnValue(interpreter);
    runScript();
    expect(interpreter.start).toHaveBeenCalled();
  });
  it("should wrap the interpreter state in a readable", () => {
    const interpreter = {
      send: jest.fn(),
      start: jest.fn(() => interpreter),
      state: {},
    };
    mocks.interpret.mockReturnValue(interpreter);
    runScript();
    expect(mocks.readable).toHaveBeenCalledWith(
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
    mocks.interpret.mockReturnValue(interpreter);
    runScript();
    const [, start] = mocks.readable.mock.calls[0];
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
    mocks.interpret.mockReturnValue(interpreter);
    const readable = {};
    mocks.readable.mockReturnValue(readable);
    const { state } = runScript();
    expect(state).toBe(readable);
  });
  it("should export the interpreter send function", () => {
    const interpreter = {
      send: jest.fn(),
      start: jest.fn(() => interpreter),
      state: {},
    };
    mocks.interpret.mockReturnValue(interpreter);
    const { send } = runScript();
    expect(send).toBe(interpreter.send);
  });
});
