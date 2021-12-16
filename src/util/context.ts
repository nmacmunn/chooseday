import type {
  AppContext,
  CriteriaContext,
  DecisionContext,
  // DecisionsContext,
  ErrorContext,
  // LoadingContext,
  // OptionsContext,
  RatingsContext,
  // ResultsContext,
  SignedinContext,
  // SignedoutContext,
} from "src/types/context";

// export function isLoadingContext(
//   context: AppContext
// ): context is LoadingContext {
//   return true;
// }

export function isSignedinContext(
  context: AppContext
): context is SignedinContext {
  return context.user !== undefined;
}

// export function isSignedoutContext(
//   context: AppContext
// ): context is SignedoutContext {
//   return context.user === undefined;
// }

// export function isDecisionsContext(
//   context: AppContext
// ): context is DecisionsContext {
//   return context.user !== undefined;
// }

export function isDecisionContext(
  context: AppContext
): context is DecisionContext {
  return context.decision !== undefined && context.user !== undefined;
}

// export function isOptionsContext(
//   context: AppContext
// ): context is OptionsContext {
//   return context.decision !== undefined && context.user !== undefined;
// }

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

// export function isCollaboratorsContext(
//   context: AppContext
// ): context is AppContext {
//   return context.decision !== undefined && context.user !== undefined;
// }

// export function isResultsContext(
//   context: AppContext
// ): context is ResultsContext {
//   return (
//     context.criteria !== undefined &&
//     context.criteria.length >= 2 &&
//     context.decision !== undefined &&
//     context.options !== undefined &&
//     context.options.length >= 2 &&
//     context.ratings !== undefined &&
//     context.ratings.length ===
//       context.criteria.length * context.options.length &&
//     context.user !== undefined
//   );
// }
