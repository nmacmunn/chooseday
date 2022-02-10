import type {
  CollaboratorsStateValue,
  CriteriaStateValue,
  DecisionLoadedStateValue,
  DecisionLoadingStateValue,
  DecisionsLoadedStateValue,
  DecisionsLoadingStateValue,
  OptionsStateValue,
  RatingsStateValue,
  ResultsStateValue,
  RouteStateValue,
  SignedOutStateValue,
  SigningInStateValue,
} from "../util/state-value";

import type {
  CollaboratorsContext,
  CriteriaContext,
  DecisionLoadedContext,
  DecisionLoadingContext,
  DecisionsLoadedContext,
  DecisionsLoadingContext,
  ErrorContext,
  OptionsContext,
  PreAuthContext,
  RatingsContext,
  ResultsContext,
  RouteContext,
  SignedOutContext,
  SigningInContext,
} from "./context";

export type AppState =
  | CollaboratorsState
  | CriteriaState
  | DecisionLoadedState
  | DecisionLoadingState
  | DecisionsLoadedState
  | DecisionsLoadingState
  | ErrorState
  | OptionsState
  | PreAuthState
  | RatingsState
  | ResultsState
  | RouteState
  | SignedOutState
  | SigningInState;

export interface CollaboratorsState {
  value: CollaboratorsStateValue;
  context: CollaboratorsContext;
}

export interface CriteriaState {
  value: CriteriaStateValue;
  context: CriteriaContext;
}

export interface DecisionLoadedState {
  value: DecisionLoadedStateValue;
  context: DecisionLoadedContext;
}

export interface DecisionLoadingState {
  value: DecisionLoadingStateValue;
  context: DecisionLoadingContext;
}

export interface DecisionsLoadedState {
  value: DecisionsLoadedStateValue;
  context: DecisionsLoadedContext;
}

export interface DecisionsLoadingState {
  value: DecisionsLoadingStateValue;
  context: DecisionsLoadingContext;
}

export interface ErrorState {
  value: "error";
  context: ErrorContext;
}

export interface OptionsState {
  value: OptionsStateValue;
  context: OptionsContext;
}

export interface PreAuthState {
  value: "preAuth";
  context: PreAuthContext;
}

export interface RatingsState {
  value: RatingsStateValue;
  context: RatingsContext;
}

export interface ResultsState {
  value: ResultsStateValue;
  context: ResultsContext;
}

export interface RouteState {
  value: RouteStateValue;
  context: RouteContext;
}

export interface SigningInState {
  value: SigningInStateValue;
  context: SigningInContext;
}

export interface SignedOutState {
  value: SignedOutStateValue;
  context: SignedOutContext;
}
