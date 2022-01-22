import type {
  CollaboratorsContext,
  CreatingContext,
  CriteriaContext,
  DecisionLoadingContext,
  DecisionsLoadedContext,
  DecisionsLoadingContext,
  ErrorContext,
  OptionsContext,
  PreAuthContext,
  RatingsContext,
  ResultsContext,
  SignedOutContext,
  SigningInContext,
} from "./context";

export type AppState =
  | CollaboratorsState
  | CreatingState
  | CriteriaState
  | DecisionLoadingState
  | DecisionsLoadedState
  | DecisionsLoadingState
  | ErrorState
  | OptionsState
  | PreAuthState
  | RatingsState
  | ResultsState
  | SignedOutState
  | SigningInState;

export interface CollaboratorsState {
  value: { auth: { signedIn: { decision: { loaded: "collaborators" } } } };
  context: CollaboratorsContext;
}

export interface CreatingState {
  value: { auth: { signedIn: { decisions: "creating" } } };
  context: CreatingContext;
}

export interface CriteriaState {
  value: { auth: { signedIn: { decision: { loaded: "criteria" } } } };
  context: CriteriaContext;
}

export interface DecisionLoadingState {
  value: { auth: { signedIn: { decision: "loading" } } };
  context: DecisionLoadingContext;
}

export interface DecisionsLoadedState {
  value: { auth: { signedIn: { decisions: "loaded" } } };
  context: DecisionsLoadedContext;
}

export interface DecisionsLoadingState {
  value: { auth: { signedIn: { decisions: "loading" } } };
  context: DecisionsLoadingContext;
}

export interface ErrorState {
  value: "error";
  context: ErrorContext;
}

export interface OptionsState {
  value: { auth: { signedIn: { decision: { loaded: "options" } } } };
  context: OptionsContext;
}

export interface PreAuthState {
  value: "preAuth";
  context: PreAuthContext;
}

export interface RatingsState {
  value: { auth: { signedIn: { decision: { loaded: "ratings" } } } };
  context: RatingsContext;
}

export interface ResultsState {
  value: { auth: { signedIn: { decision: { loaded: "results" } } } };
  context: ResultsContext;
}

export interface SigningInState {
  value: { auth: "signingIn" };
  context: SigningInContext;
}

export interface SignedOutState {
  value: { auth: "signedOut" };
  context: SignedOutContext;
}
