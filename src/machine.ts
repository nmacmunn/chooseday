import { readable } from "svelte/store";
import { createMachine, interpret } from "xstate";
import { getRedirectResult } from "./service/auth";
import type { BaseContext } from "./types/context";
import type { AppEvent } from "./types/events";
import type { AppState } from "./types/state";
import * as actions from "./util/action";
import * as guards from "./util/guard";
import * as services from "./util/service";

const machine = createMachine<BaseContext, AppEvent, AppState>({
  initial: "initial",
  context: {},
  on: {
    ERROR: {
      actions: actions.setError,
    },
  },
  always: {
    target: "error",
    cond: guards.enterError,
  },
  states: {
    error: {},
    initial: {
      invoke: {
        src: getRedirectResult,
        onDone: "root",
        onError: {
          target: "root",
          actions: actions.authError,
        },
      },
    },
    root: {
      initial: "loading",
      invoke: {
        src: services.userIdListener,
      },
      states: {
        loading: {},
        signedIn: {
          initial: "decisions",
          states: {
            decisions: {
              invoke: {
                src: services.decisionsListener,
              },
            },
            decision: {
              initial: "options",
              invoke: {
                src: services.decisionListener,
              },
              on: {
                OPTIONS: {
                  target: ".options",
                },
                OPTIONSLOADED: {
                  actions: actions.setOptions,
                },
                CRITERIA: {
                  target: ".criteria",
                  cond: guards.enoughOptions,
                },
                CRITERIALOADED: {
                  actions: actions.setCriteria,
                },
                RATINGS: {
                  target: ".ratings",
                  cond: guards.enoughCriteria,
                },
                CRITERION: {
                  cond: guards.doneRatingCurrent,
                  actions: actions.setCriterion,
                },
                RATINGSLOADED: {
                  actions: actions.setRatings,
                },
                COLLABORATORS: {
                  target: ".collaborators",
                  cond: guards.doneRating,
                },
                RESULTS: {
                  target: ".results",
                  cond: guards.doneRating,
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
              actions: actions.clearDecision,
            },
            DECISION: {
              target: ".decision",
              actions: actions.setDecision,
            },
            COLLABORATORDECISIONSLOADED: {
              actions: actions.setCollaboratorDecisions,
            },
            CREATORDECISIONSLOADED: {
              actions: actions.setCreatorDecisions,
            },
          },
        },
        signedOut: {},
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
  },
});

const interpreter = interpret(machine).start();

export const state = readable(interpreter.state, (set) => {
  interpreter.onTransition((state) => {
    set(state);
  });
});

export const { send } = interpreter;
