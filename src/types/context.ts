import type { Result } from "../model/result";
import type { Criterion, Decision, Option, Rating, User } from "./data";

export type AppContext =
  | CollaboratorsContext
  | CriteriaContext
  | DecisionLoadingContext
  | DecisionsLoadedContext
  | DecisionsLoadingContext
  | ErrorContext
  | OptionsContext
  | PreAuthContext
  | RatingsContext
  | ResultsContext
  | SignedOutContext
  | SigningInContext;

export interface BaseContext {
  criteria?: Criterion[];
  criterion?: Criterion;
  creatorDecisions?: Decision[];
  collaboratorDecisions?: Decision[];
  decision?: Decision;
  decisionId?: string;
  error?: string;
  ratings?: Rating[];
  result?: Result;
  options?: Option[];
  user?: User;
  userCriteria?: Criterion[];
  userRatings?: Rating[];
}

export interface CollaboratorsContext extends RatingsContext {}

export interface CriteriaContext extends OptionsContext {
  options: [Option, Option, ...Option[]];
}

export interface DecisionLoadedContext extends DecisionLoadingContext {
  criteria: Criterion[];
  decision: Decision;
  options: Option[];
  ratings: Rating[];
  result: Result;
  userCriteria: Criterion[];
  userRatings: Rating[];
}

export interface DecisionLoadingContext extends SignedInContext {
  decisionId: string;
}

export interface DecisionsLoadedContext extends DecisionsLoadingContext {
  collaboratorDecisions: Decision[];
  creatorDecisions: Decision[];
}

export interface DecisionsLoadingContext extends SignedInContext {}

export interface ErrorContext extends BaseContext {
  error: string;
}

export interface OptionsContext extends DecisionLoadedContext {}

export interface PreAuthContext extends BaseContext {}

export interface RatingsContext extends CriteriaContext {
  criteria: [Criterion, Criterion, ...Criterion[]];
  criterion: Criterion;
  ratings: [Rating, Rating, Rating, Rating, ...Rating[]];
  userCriteria: [Criterion, Criterion, ...Criterion[]];
  userRatings: [Rating, Rating, Rating, Rating, ...Rating[]];
}

export interface ResultsContext extends RatingsContext {}

export interface RouteContext extends SignedInContext {}

export interface SignedInContext extends BaseContext {
  user: User;
}

export interface SignedOutContext extends BaseContext {
  user: undefined;
}

export interface SigningInContext extends BaseContext {}
