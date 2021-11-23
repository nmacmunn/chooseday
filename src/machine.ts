import { assign, createMachine, interpret } from "xstate";
import type { Criterion, Decision, Option, Rating, User } from "./types/data";
import { authListener, getRedirectResult } from "./auth";
import {
  subscribeCriteria,
  subscribeDecisions,
  subscribeOptions,
  subscribeRatings,
} from "./db";
import { readable } from "svelte/store";
import type { AppEvent } from "./types/events";
import type { AppState } from "./types/states";
import UIKit from "uikit";

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
                  },
                  CRITERION: {
                    cond: "hasCriterion",
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
                    cond: "enoughOptions",
                  },
                  RESULTS: {
                    target: ".results",
                    cond: "enoughRatings",
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
                actions: assign({
                  decision: (_context, _event) => undefined,
                }),
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
      authError() {
        UIKit.modal.alert(
          "Failed to link account. This probably means that you have already linked another guest account. Try signing in with your Google account."
        );
      },
    },
    guards: {
      enoughOptions(context) {
        return context.options !== undefined && context.options.length > 1;
      },
      enoughCriteria(context) {
        const { user, criteria } = context;
        return (
          user !== undefined &&
          criteria !== undefined &&
          criteria.filter((criterion) => criterion.user.id === user.id).length >
            1
        );
      },
      enoughRatings(context) {
        const { user, ratings } = context;
        return (
          user !== undefined &&
          ratings !== undefined &&
          ratings.filter((rating) => rating.user.id === user.id).length > 3
        );
      },
      hasCriterion(context, event) {
        const { user } = context;
        return (
          user !== undefined &&
          event.type === "CRITERION" &&
          event.criterion.user.id === user.id
        );
      },
      // isCreator({ decision, options, user }) {
      //   return (
      //     // must have two options
      //     options !== undefined &&
      //     options.length > 1
      //     // must be the creator
      //     // decision !== undefined &&
      //     // user !== undefined &&
      //     // decision.creator.id === user.id
      //   );
      // },
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
