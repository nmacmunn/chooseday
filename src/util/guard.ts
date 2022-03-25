import type { AppContext } from "src/types/context";
import type { AppEvent } from "src/types/events";
import type { ConditionPredicate } from "xstate";
import {
  isCriteriaContext,
  isDecisionLoadedContext,
  isDecisionsLoadedContext,
  isErrorContext,
  isRatingsContext,
} from "./context";

export const decisionLoaded = isDecisionLoadedContext;

export const decisionsLoaded = isDecisionsLoadedContext;

/**
 * Ensure the user has finished rating the current criterion.
 */
export function doneRatingCurrent(context: AppContext): boolean {
  if (!isRatingsContext(context)) {
    return false;
  }
  return context.result.criterionIsDone(context.criterion);
}

/**
 * Ensure user has finished rating all criteria.
 */
export function doneRating(context: AppContext) {
  if (!isRatingsContext(context)) {
    return false;
  }
  return context.result.userIsDone(context.user);
}

/**
 * Ensure user has created enough options.
 */
export const enoughOptions = isCriteriaContext;

/**
 * Ensure user has created enough options and criteria.
 */
export const enoughOptionsAndCriteria = isRatingsContext;

/**
 * Whether to enter the error state.
 */
export const enterError: ConditionPredicate<AppContext, AppEvent> = function (
  context,
  _,
  meta
): boolean {
  return isErrorContext(context) && !meta.state.matches("error");
};

export function noError({ error }: AppContext) {
  return !error;
}
