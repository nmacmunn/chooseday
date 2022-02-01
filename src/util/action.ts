import _ from "lodash";
import { assign } from "xstate";
import type { BaseContext } from "../types/context";
import type {
  AppEvent,
  CollaboratorDecisionsLoadedEvent,
  CreatingEvent,
  CreatorDecisionsLoadedEvent,
  CriteriaLoadedEvent,
  CriterionEvent,
  DecisionEvent,
  DecisionsEvent,
  ErrorEvent,
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

export const clearUser = assign<BaseContext, SignoutEvent>({
  user: undefined,
});

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

export const setDecision = assign<BaseContext, DecisionEvent>({
  decision: pick("decision"),
});

export const setDecisionId = assign<BaseContext, CreatingEvent>({
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
