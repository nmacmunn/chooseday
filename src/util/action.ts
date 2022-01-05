import UIkit from "uikit";
import { assign } from "xstate";
import type { BaseContext } from "../types/context";
import type {
  AppEvent,
  CollaboratorDecisionsLoadedEvent,
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

/**
 * Return a function that returns the specified key from events.
 * @private
 */
function pick<T extends AppEvent, K extends keyof T>(key: K) {
  return (_context: BaseContext, event: T) => event[key];
}

/**
 * Show an alert when there is an authentication error.
 */
export function authError() {
  UIkit.modal.alert(
    "Failed to link account. This probably means that you have already linked another guest account. Try signing in with your Google account."
  );
}

export const clearDecision = assign<BaseContext, DecisionsEvent>({
  criteria: undefined,
  criterion: undefined,
  decision: undefined,
  options: undefined,
  ratings: undefined,
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

export const setCriteria = assign<BaseContext, CriteriaLoadedEvent>({
  criteria: pick("criteria"),
  criterion: ({ criterion }, { criteria }) => {
    if (criterion && criteria.indexOf(criterion) !== -1) {
      return criterion;
    }
    return criteria[0];
  },
});

export const setCriterion = assign<BaseContext, CriterionEvent>({
  criterion: pick("criterion"),
});

export const setDecision = assign<BaseContext, DecisionEvent>({
  decision: pick("decision"),
});

export const setError = assign<BaseContext, ErrorEvent>({
  error: pick("error"),
});

export const setOptions = assign<BaseContext, OptionsLoadedEvent>({
  options: pick("options"),
});

export const setRatings = assign<BaseContext, RatingsLoadedEvent>({
  ratings: pick("ratings"),
});

export const setUser = assign<BaseContext, SigninEvent>({
  user: pick("user"),
});