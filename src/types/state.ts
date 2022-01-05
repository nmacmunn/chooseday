import type {
  CollaboratorsContext,
  CriteriaContext,
  DecisionContext,
  DecisionsContext,
  ErrorContext,
  LoadingContext,
  OptionsContext,
  RatingsContext,
  ResultsContext,
  SignedinContext,
  SignedoutContext,
} from "./context";

export interface ErrorState {
  value: "error";
  context: ErrorContext;
}

export interface LoadingState {
  value: { root: "loading" };
  context: LoadingContext;
}

export interface SignedinState {
  value: { root: "signedIn" };
  context: SignedinContext;
}

export interface SignedoutState {
  value: { root: "signedOut" };
  context: SignedoutContext;
}

export interface DecisionsState {
  value: { root: { signedIn: "decisions" } };
  context: DecisionsContext;
}

export interface DecisionState {
  value: { root: { signedIn: "decision" } };
  context: DecisionContext;
}

export interface OptionsState {
  value: { root: { signedIn: { decision: "options" } } };
  context: OptionsContext;
}

export interface CriteriaState {
  value: { root: { signedIn: { decision: "criteria" } } };
  context: CriteriaContext;
}

export interface RatingsState {
  value: { root: { signedIn: { decision: "ratings" } } };
  context: RatingsContext;
}

export interface CollaboratorsState {
  value: { root: { signedIn: { decision: "collaborators" } } };
  context: CollaboratorsContext;
}

export interface ResultsState {
  value: { root: { signedIn: { decision: "results" } } };
  context: ResultsContext;
}

export type AppState =
  | ErrorState
  | LoadingState
  | SignedinState
  | SignedoutState
  | DecisionsState
  | DecisionState
  | OptionsState
  | CriteriaState
  | RatingsState
  | CollaboratorsState
  | ResultsState;
