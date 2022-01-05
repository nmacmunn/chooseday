import type { Criterion, Decision, Option, Rating, User } from "./data";

export interface BaseContext {
  criteria?: Criterion[];
  criterion?: Criterion;
  creatorDecisions?: Decision[];
  collaboratorDecisions?: Decision[];
  decision?: Decision;
  error?: string;
  ratings?: Rating[];
  options?: Option[];
  user?: User;
}

export interface ErrorContext extends BaseContext {
  error: string;
}

export interface LoadingContext extends BaseContext {}

export interface SignedinContext extends BaseContext {
  user: User;
}

export interface SignedoutContext extends BaseContext {
  user: undefined;
}

export interface DecisionsContext extends BaseContext {
  user: User;
}

export interface DecisionContext extends BaseContext {
  decision: Decision;
  user: User;
}

export interface OptionsContext extends BaseContext {
  decision: Decision;
  user: User;
}

export interface CriteriaContext extends BaseContext {
  decision: Decision;
  options: [Option, Option, ...Option[]];
  user: User;
}

export interface RatingsContext extends BaseContext {
  criteria: [Criterion, Criterion, ...Criterion[]];
  criterion: Criterion;
  decision: Decision;
  options: [Option, Option, ...Option[]];
  ratings: [Rating, Rating, Rating, Rating, ...Rating[]];
  user: User;
}

export interface CollaboratorsContext extends BaseContext {
  decision: Decision;
  user: User;
}

export interface ResultsContext extends BaseContext {
  criteria: [Criterion, Criterion, ...Criterion[]];
  decision: Decision;
  options: [Option, Option, ...Option[]];
  ratings: [Rating, Rating, Rating, Rating, ...Rating[]];
  user: User;
}

export type AppContext =
  | LoadingContext
  | ErrorContext
  | SignedinContext
  | SignedoutContext
  | DecisionsContext
  | DecisionContext
  | OptionsContext
  | CriteriaContext
  | RatingsContext
  | CollaboratorsContext
  | ResultsContext;
