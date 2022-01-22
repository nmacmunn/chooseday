import type { Criterion, Decision, Option, Rating, User } from "./data";

export type AppEvent =
  | CollaboratorDecisionsLoadedEvent
  | CollaboratorsEvent
  | CreatingEvent
  | CreatorDecisionsLoadedEvent
  | CriteriaEvent
  | CriteriaLoadedEvent
  | CriterionEvent
  | DecisionEvent
  | DecisionsEvent
  | ErrorEvent
  | OptionsEvent
  | OptionsLoadedEvent
  | RatingsEvent
  | RatingsLoadedEvent
  | RedirectResultEvent
  | ResultsEvent
  | SigninEvent
  | SignoutEvent;

export interface CollaboratorDecisionsLoadedEvent {
  type: "COLLABORATORDECISIONSLOADED";
  decisions: Decision[];
}

export interface CollaboratorsEvent {
  type: "COLLABORATORS";
}

export interface CreatingEvent {
  type: "CREATING";
  decisionId: string;
}

export interface CreatorDecisionsLoadedEvent {
  type: "CREATORDECISIONSLOADED";
  decisions: Decision[];
}

export interface CriteriaEvent {
  type: "CRITERIA";
}

export interface CriteriaLoadedEvent {
  type: "CRITERIALOADED";
  criteria: Criterion[];
}

export interface CriterionEvent {
  type: "CRITERION";
  criterion: Criterion;
}

export interface DecisionEvent {
  type: "DECISION";
  decision: Decision;
}

export interface DecisionsEvent {
  type: "DECISIONS";
}

export interface ErrorEvent {
  type: "ERROR";
  error: string;
}

export interface OptionsEvent {
  type: "OPTIONS";
}

export interface OptionsLoadedEvent {
  type: "OPTIONSLOADED";
  options: Option[];
}

export interface RatingsEvent {
  type: "RATINGS";
}

export interface RatingsLoadedEvent {
  type: "RATINGSLOADED";
  ratings: Rating[];
}

export interface RedirectResultEvent {
  type: "REDIRECTRESULT";
}

export interface ResultsEvent {
  type: "RESULTS";
}

export interface SigninEvent {
  type: "SIGNIN";
  user: User;
}

export interface SignoutEvent {
  type: "SIGNOUT";
}
