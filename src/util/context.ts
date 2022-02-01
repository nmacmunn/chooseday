import type {
  AppContext,
  CriteriaContext,
  DecisionLoadedContext,
  DecisionLoadingContext,
  DecisionsLoadedContext,
  DecisionsLoadingContext,
  ErrorContext,
  RatingsContext,
} from "../types/context";

export function isCriteriaContext(
  context: AppContext
): context is CriteriaContext {
  return isOptionsContext(context) && context.options.length >= 2;
}

export function isDecisionLoadedContext(
  context: AppContext
): context is DecisionLoadedContext {
  return (
    isDecisionLoadingContext(context) &&
    context.criteria !== undefined &&
    context.options !== undefined &&
    context.ratings !== undefined &&
    context.userCriteria !== undefined &&
    context.userRatings !== undefined
  );
}

export function isDecisionLoadingContext(
  context: AppContext
): context is DecisionLoadingContext {
  return context.decision !== undefined && context.user !== undefined;
}

export function isDecisionsLoadedContext(
  context: AppContext
): context is DecisionsLoadedContext {
  return (
    isDecisionsLoadingContext(context) &&
    context.collaboratorDecisions !== undefined &&
    context.creatorDecisions !== undefined
  );
}

export function isDecisionsLoadingContext(
  context: AppContext
): context is DecisionsLoadingContext {
  return context.user !== undefined;
}

export function isErrorContext(context: AppContext): context is ErrorContext {
  return context.error !== undefined;
}

export const isOptionsContext = isDecisionLoadedContext;

export function isRatingsContext(
  context: AppContext
): context is RatingsContext {
  return (
    isCriteriaContext(context) &&
    context.userCriteria.length >= 2 &&
    context.criterion !== undefined &&
    context.userRatings.length >= 4
  );
}
