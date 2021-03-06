import _ from "lodash";
import type { ActionMeta } from "xstate";
import { assign } from "xstate";
import { pushHistory } from "./history";
import { stateValue } from "./state-value";
import type { BaseContext } from "../types/context";
import type {
  AppEvent,
  CollaboratorDecisionsLoadedEvent,
  CreatorDecisionsLoadedEvent,
  CriteriaLoadedEvent,
  CriterionEvent,
  DecisionLoadedEvent,
  DecisionsEvent,
  ErrorEvent,
  HomeEvent,
  LoadEvent,
  OptionsLoadedEvent,
  RatingsLoadedEvent,
  SigninEvent,
  SignoutEvent,
} from "../types/events";
import { getResult } from "./result";

/**
 * Return a function that returns the specified key from an event.
 * @private
 */
function pick<T extends AppEvent, K extends keyof T>(key: K) {
  return (_context: BaseContext, event: T) => event[key];
}

/**
 * Show an alert when there is an authentication error.
 */
// export function authError() {
//   UIkit.modal.alert(
//     "Failed to link account. This probably means that you have already linked another guest account. Try signing in with your Google account."
//   );
// }

export const clearDecision = assign<BaseContext, DecisionsEvent>({
  criteria: undefined,
  criterion: undefined,
  decision: undefined,
  options: undefined,
  ratings: undefined,
  result: undefined,
});

/**
 * Clear the error and url (in case it's the cause).
 */
export const clearError = assign<BaseContext, HomeEvent>({
  error: () => {
    pushHistory("/decisions");
    return undefined;
  },
});

export const clearUser = assign<BaseContext, SignoutEvent>({
  user: undefined,
});

/**
 * Push the url corresponding to the current state onto the history stack.
 */
export function pushUrl<T extends BaseContext, U extends AppEvent>(
  context: T,
  _e: U,
  meta: ActionMeta<T, U>
) {
  if (meta.state.matches(stateValue.decisionsLoaded)) {
    document.title = "Chooseday";
    pushHistory("/decisions");
  } else if (meta.state.matches(stateValue.decisionLoaded)) {
    document.title = "Chooseday - " + context.decision?.title;
    pushHistory("/decision/" + context.decisionId);
  }
}

export const setCollaboratorDecisions = assign<
  BaseContext,
  CollaboratorDecisionsLoadedEvent
>({
  collaboratorDecisions: pick("decisions"),
});

export const setCreatorDecisions = assign<
  BaseContext,
  CreatorDecisionsLoadedEvent
>({
  creatorDecisions: pick("decisions"),
});

export const setCriteria = assign<BaseContext, CriteriaLoadedEvent>(
  (context, { criteria }) => {
    const { user } = context;
    let { criterion } = context;
    const filter = _.matchesProperty("user.id", user?.id);
    const userCriteria = criteria.filter(filter);
    if (!criterion || !_.includes(criteria, criterion)) {
      criterion = userCriteria[0];
    }
    const result = getResult({
      ...context,
      criteria,
      criterion,
      userCriteria,
    });
    return {
      criteria,
      criterion,
      result,
      userCriteria,
    };
  }
);

export const setCriterion = assign<BaseContext, CriterionEvent>({
  criterion: pick("criterion"),
});

export const setDecision = assign<BaseContext, DecisionLoadedEvent>({
  decision: pick("decision"),
});

export const setDecisionId = assign<BaseContext, LoadEvent>({
  decisionId: pick("decisionId"),
});

export const setError = assign<BaseContext, ErrorEvent>({
  error: pick("error"),
});

export const setOptions = assign<BaseContext, OptionsLoadedEvent>({
  options: pick("options"),
});

export const setRatings = assign<BaseContext, RatingsLoadedEvent>(
  (context, { ratings }) => {
    const { user } = context;
    const filter = _.matchesProperty("user.id", user?.id);
    const userRatings = ratings.filter(filter);
    const result = getResult({
      ...context,
      ratings,
      userRatings,
    });
    return {
      ratings,
      result,
      userRatings,
    };
  }
);

export const setUser = assign<BaseContext, SigninEvent>({
  user: pick("user"),
});
