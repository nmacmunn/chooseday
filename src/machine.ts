import { readable } from "svelte/store";
import { assign, createMachine, interpret } from "xstate";
import { authListener, getRedirectResult } from "./auth";
import {
  subscribeCriteria,
  subscribeDecisions,
  subscribeOptions,
  subscribeRatings,
} from "./db";
import type { Criterion, Decision, Option, Rating, User } from "./types/data";
import type { AppEvent } from "./types/events";
import type { AppState } from "./types/states";
import { assignCriterion, authError, clearDecision } from "./util/actions";
import {
  doneRating,
  doneRatingCurrent,
  enoughCriteria,
  enoughOptions,
} from "./util/guards";

export interface AppContext {
  criteria?: Criterion[];
  criterion?: Criterion;
  creator?: Decision[];
  collaborator?: Decision[];
  decision?: Decision;
  ratings?: Rating[];
  options?: Option[];
  user?: User;
}

const machine = createMachine<AppContext, AppEvent, AppState>(
  {
    initial: "initial",
    context: {},
    states: {
      initial: {
        invoke: {
          src: () => getRedirectResult(),
          onDone: "root",
          onError: {
            target: "root",
            actions: "authError",
          },
        },
      },
      root: {
        initial: "loading",
        invoke: {
          src: "userIdListener",
        },
        states: {
          loading: {},
          signedIn: {
            initial: "decisions",
            states: {
              decisions: {
                invoke: {
                  src: "decisionsListener",
                },
              },
              decision: {
                initial: "options",
                invoke: {
                  src: "decisionListener",
                },
                on: {
                  OPTIONS: {
                    target: ".options",
                  },
                  OPTIONSLOADED: {
                    actions: assign({
                      options: (_context, event) => event.options,
                    }),
                  },
                  CRITERIA: {
                    target: ".criteria",
                    cond: "enoughOptions",
                  },
                  CRITERIALOADED: {
                    actions: assign({
                      criteria: (_context, event) => event.criteria,
                    }),
                  },
                  RATINGS: {
                    target: ".ratings",
                    cond: "enoughCriteria",
                    actions: "assignCriterion",
                  },
                  CRITERION: {
                    cond: "doneRatingCurrent",
                    actions: assign({
                      criterion: (_context, event) => event.criterion,
                    }),
                  },
                  RATINGSLOADED: {
                    actions: assign({
                      ratings: (_context, event) => event.ratings,
                    }),
                  },
                  COLLABORATORS: {
                    target: ".collaborators",
                    cond: "doneRating",
                  },
                  RESULTS: {
                    target: ".results",
                    cond: "doneRating",
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
                actions: "clearDecision",
              },
              DECISION: {
                target: ".decision",
                actions: assign({
                  decision: (_context, event) => event.decision,
                }),
              },
              DECISIONSLOADED: {
                actions: assign({
                  collaborator: (_context, event) => event.collaborator,
                  creator: (_context, event) => event.creator,
                }),
              },
            },
          },
          signedOut: {},
        },
        on: {
          SIGNIN: {
            target: ".signedIn",
            actions: assign({
              user: (_context, { user }) => user,
            }),
          },
          SIGNOUT: {
            target: ".signedOut",
            actions: assign({
              user: (_context) => undefined,
            }),
          },
        },
      },
    },
  },
  {
    actions: {
      assignCriterion,
      authError,
      clearDecision,
    },
    guards: {
      doneRating,
      doneRatingCurrent,
      enoughOptions,
      enoughCriteria,
    },
    services: {
      userIdListener() {
        return (send) => {
          return authListener((user) => {
            if (user) {
              send({ type: "SIGNIN", user });
            } else {
              send("SIGNOUT");
            }
          });
        };
      },
      decisionsListener(context) {
        return (send) => {
          if (!context.user) {
            console.error("Tried to subscribe to decisions without user");
            return;
          }
          return subscribeDecisions(context.user, (decisions) => {
            send({ type: "DECISIONSLOADED", ...decisions });
          });
        };
      },
      decisionListener(context) {
        return (send) => {
          if (!context.decision) {
            console.error("Tried to subscribe to decision without decision");
            return;
          }
          const unsubOptions = subscribeOptions(
            context.decision.id,
            (options) => {
              send({ type: "OPTIONSLOADED", options });
            }
          );
          const unsubCriteria = subscribeCriteria(
            context.decision.id,
            (criteria) => {
              send({ type: "CRITERIALOADED", criteria });
            }
          );
          const unsubRatings = subscribeRatings(
            context.decision.id,
            (ratings) => {
              send({ type: "RATINGSLOADED", ratings });
            }
          );
          return () => {
            unsubOptions();
            unsubCriteria();
            unsubRatings();
          };
        };
      },
    },
  }
);

const interpreter = interpret(machine).start();

export const state = readable(interpreter.state, (set) => {
  interpreter.onTransition((state) => {
    set(state);
  });
});

export const { send } = interpreter;
