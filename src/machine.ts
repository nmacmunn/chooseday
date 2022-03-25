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
          initial: "route",
          invoke: {
            src: services.urlListener,
          },
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
                CREATORDECISIONSLOADED: {
                  actions: actions.setCreatorDecisions,
                },
              },
              states: {
                loaded: {
                  entry: actions.pushUrl,
                },
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
                DECISIONLOADED: {
                  actions: actions.setDecision,
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
                  entry: actions.pushUrl,
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
                      cond: guards.enoughOptionsAndCriteria,
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
            route: {},
          },
          on: {
            DECISIONS: {
              actions: actions.clearDecision,
              target: ".decisions",
            },
            LOAD: {
              actions: actions.setDecisionId,
              target: ".decision",
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
    error: {
      always: {
        cond: guards.noError,
        target: "auth",
      },
      on: {
        HOME: {
          actions: actions.clearError,
        },
      },
    },
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

export const { send } = interpreter;
