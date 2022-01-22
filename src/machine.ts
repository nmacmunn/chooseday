import { readable } from "svelte/store";
import { createMachine, interpret } from "xstate";
import type { BaseContext } from "./types/context";
import type { AppEvent } from "./types/events";
import type { AppState } from "./types/state";
import * as actions from "./util/action";
import * as guards from "./util/guard";
import * as services from "./util/service";

const machine = createMachine<BaseContext, AppEvent, AppState>({
  always: {
    cond: guards.enterError,
    target: "error",
  },
  context: {},
  initial: "preAuth",
  on: {
    ERROR: {
      actions: actions.setError,
    },
  },
  states: {
    auth: {
      initial: "signingIn",
      invoke: {
        src: services.userIdListener,
      },
      states: {
        signedIn: {
          initial: "decisions",
          states: {
            decisions: {
              initial: "loading",
              invoke: {
                src: services.decisionsListener,
              },
              on: {
                COLLABORATORDECISIONSLOADED: {
                  actions: actions.setCollaboratorDecisions,
                },
                CREATING: {
                  actions: actions.setDecisionId,
                  target: ".creating",
                },
                CREATORDECISIONSLOADED: {
                  actions: actions.setCreatorDecisions,
                },
                DECISION: {
                  actions: actions.setDecision,
                  target: "decision",
                },
              },
              states: {
                creating: {},
                loaded: {},
                loading: {
                  always: {
                    cond: guards.decisionsLoaded,
                    target: "loaded",
                  },
                },
              },
            },
            decision: {
              initial: "loading",
              invoke: {
                src: services.decisionListener,
              },
              on: {
                CRITERIALOADED: {
                  actions: actions.setCriteria,
                },
                OPTIONSLOADED: {
                  actions: actions.setOptions,
                },
                RATINGSLOADED: {
                  actions: actions.setRatings,
                },
              },
              states: {
                loaded: {
                  initial: "options",
                  on: {
                    COLLABORATORS: {
                      cond: guards.doneRating,
                      target: ".collaborators",
                    },
                    CRITERIA: {
                      cond: guards.enoughOptions,
                      target: ".criteria",
                    },
                    CRITERION: {
                      cond: guards.doneRatingCurrent,
                      actions: actions.setCriterion,
                    },
                    OPTIONS: {
                      target: ".options",
                    },
                    RATINGS: {
                      cond: guards.enoughCriteria,
                      target: ".ratings",
                    },
                    RESULTS: {
                      cond: guards.doneRating,
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
                    cond: guards.decisionLoaded,
                    target: "loaded",
                  },
                },
              },
            },
          },
          on: {
            DECISIONS: {
              target: ".decisions",
              actions: actions.clearDecision,
            },
          },
        },
        signedOut: {},
        signingIn: {},
      },
      on: {
        SIGNIN: {
          target: ".signedIn",
          actions: actions.setUser,
        },
        SIGNOUT: {
          target: ".signedOut",
          actions: actions.clearUser,
        },
      },
    },
    error: {},
    preAuth: {
      invoke: {
        src: services.redirectResultListener,
      },
      on: {
        REDIRECTRESULT: "auth",
      },
    },
  },
});

const interpreter = interpret(machine).start();

export const state = readable(interpreter.state, (set) => {
  interpreter.onTransition((state) => {
    set(state);
  });
});

export const states = {
  preAuth: "preAuth",
  signingIn: { auth: "signingIn" },
  decisionLoading: {
    auth: { signedIn: { decision: "loading" } },
  },
  decisionsLoading: {
    auth: { signedIn: { decisions: "loading" } },
  },
};

export const { send } = interpreter;
