import _ from "lodash";
import type { AppContext, ResultsContext } from "src/types/context";
import type { AppEvent } from "src/types/events";
import type { ConditionPredicate } from "xstate";
import {
  isCriteriaContext,
  isDecisionLoadedContext,
  isDecisionsLoadedContext,
  isErrorContext,
  isRatingsContext,
} from "./context";
import { processResults } from "./results";

export const decisionLoaded = isDecisionLoadedContext;

export const decisionsLoaded = isDecisionsLoadedContext;

/**
 * Ensure the user has finished rating the current criterion.
 */
export function doneRatingCurrent(context: AppContext): boolean {
  if (!isRatingsContext(context)) {
    return false;
  }
  const { criterion, ratings } = context;
  const results = processResults({
    ...context,
    criteria: [criterion],
    ratings: ratings.filter(_.matchesProperty("criterionId", criterion.id)),
  } as unknown as ResultsContext);
  return Object.values(results.byOption).every(Number.isFinite);
}

/**
 * Ensure user has finished rating all criteria.
 */
export function doneRating(context: AppContext) {
  if (!isRatingsContext(context)) {
    return false;
  }
  const { user, criteria, ratings } = context;
  const predicate = _.matchesProperty("user.id", user.id);
  const results = processResults({
    ...context,
    criteria: criteria.filter(predicate),
    ratings: ratings.filter(predicate),
  } as unknown as ResultsContext);
  return Object.values(results.byOption).every(Number.isFinite);
}

/**
 * Ensure user has created enough criteria.
 */
export function enoughCriteria(context: AppContext): boolean {
  const { user, criteria } = context;
  return (
    user !== undefined &&
    criteria !== undefined &&
    criteria.filter(_.matchesProperty("user.id", user.id)).length > 1
  );
}

/**
 * Ensure user has created enough options.
 */
export const enoughOptions = isCriteriaContext;

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
