import type { Criterion, Decision, Option, Rating, User } from "./data";

export interface ErrorEvent {
  type: "ERROR";
  error: string;
}

export interface SigninEvent {
  type: "SIGNIN";
  user: User;
}

export interface SignoutEvent {
  type: "SIGNOUT";
}

export interface DecisionEvent {
  type: "DECISION";
  decision: Decision;
}

export interface DecisionsEvent {
  type: "DECISIONS";
}

export interface CollaboratorDecisionsLoadedEvent {
  type: "COLLABORATORDECISIONSLOADED";
  decisions: Decision[];
}

export interface CreatorDecisionsLoadedEvent {
  type: "CREATORDECISIONSLOADED";
  decisions: Decision[];
}

export interface OptionsEvent {
  type: "OPTIONS";
}

export interface OptionsLoadedEvent {
  type: "OPTIONSLOADED";
  options: Option[];
}

export interface CriteriaEvent {
  type: "CRITERIA";
}

export interface CriteriaLoadedEvent {
  type: "CRITERIALOADED";
  criteria: Criterion[];
}

export interface RatingsEvent {
  type: "RATINGS";
}

export interface CriterionEvent {
  type: "CRITERION";
  criterion: Criterion;
}

export interface RatingsLoadedEvent {
  type: "RATINGSLOADED";
  ratings: Rating[];
}

export interface CollaboratorsEvent {
  type: "COLLABORATORS";
}

export interface ResultsEvent {
  type: "RESULTS";
}

export type AppEvent =
  | ErrorEvent
  | SigninEvent
  | SignoutEvent
  | DecisionEvent
  | DecisionsEvent
  | CollaboratorDecisionsLoadedEvent
  | CreatorDecisionsLoadedEvent
  | OptionsEvent
  | OptionsLoadedEvent
  | CriteriaEvent
  | CriteriaLoadedEvent
  | RatingsEvent
  | CriterionEvent
  | RatingsLoadedEvent
  | CollaboratorsEvent
  | ResultsEvent;
