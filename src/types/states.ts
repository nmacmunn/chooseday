import type { Criterion, Decision, Option, Rating, User } from "./data";

export interface LoadingState {
  value: { root: "loading" };
  context: {};
}

export interface SignedinState {
  value: { root: "signedIn" };
  context: {
    user: User;
  };
}

export interface SignedoutState {
  value: { root: "signedOut" };
  context: {
    user: undefined;
  };
}

export interface DecisionsState {
  value: { root: { signedIn: "decisions" } };
  context: {
    collaborator?: Decision[];
    creator?: Decision[];
    user: User;
  };
}

export interface DecisionState {
  value: { root: { signedIn: "decision" } };
  context: {
    decision: Decision;
    user: User;
  };
}

export interface OptionsState {
  value: { root: { signedIn: { decision: "options" } } };
  context: {
    decision: Decision;
    user: User;
    options?: Option[];
  };
}

export interface CriteriaState {
  value: { root: { signedIn: { decision: "criteria" } } };
  context: {
    decision: Decision;
    user: User;
    options: [Option, Option, ...Option[]];
    criteria?: Criterion[];
  };
}

export interface RatingsState {
  value: { root: { signedIn: { decision: "ratings" } } };
  context: {
    decision: Decision;
    user: User;
    options: [Option, Option, ...Option[]];
    criteria: [Criterion, Criterion, ...Criterion[]];
    criterion: Criterion;
    ratings?: Rating[];
  };
}

export interface CollaboratorsState {
  value: { root: { signedIn: { decision: "collaborators" } } };
  context: {
    decision: Decision;
    user: User;
  };
}

export interface ResultsState {
  value: { root: { signedIn: { decision: "results" } } };
  context: {
    decision: Decision;
    user: User;
    options: [Option, Option, ...Option[]];
    criteria: [Criterion, Criterion, ...Criterion[]];
    ratings: [Rating, Rating, Rating, Rating, ...Rating[]];
  };
}

export type AppState =
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
