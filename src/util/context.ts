import type {
  AppContext,
  CriteriaContext,
  DecisionContext,
  ErrorContext,
  RatingsContext,
  SignedinContext,
} from "../types/context";

export function isSignedinContext(
  context: AppContext
): context is SignedinContext {
  return context.user !== undefined;
}

export function isDecisionContext(
  context: AppContext
): context is DecisionContext {
  return context.decision !== undefined && context.user !== undefined;
}

export function isCriteriaContext(
  context: AppContext
): context is CriteriaContext {
  return (
    context.decision !== undefined &&
    context.options !== undefined &&
    context.options.length >= 2 &&
    context.user !== undefined
  );
}

export function isErrorContext(context: AppContext): context is ErrorContext {
  return context.error !== undefined;
}

export function isRatingsContext(
  context: AppContext
): context is RatingsContext {
  return (
    context.criteria !== undefined &&
    context.criteria.length >= 2 &&
    context.criterion !== undefined &&
    context.decision !== undefined &&
    context.options !== undefined &&
    context.options.length >= 2 &&
    context.ratings !== undefined &&
    context.ratings.length >= 4 &&
    context.user !== undefined
  );
}
