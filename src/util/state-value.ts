export type StateName = keyof typeof stateValue;
export type CollaboratorsStateValue = typeof stateValue.collaborators;
export type CriteriaStateValue = typeof stateValue.criteria;
export type DecisionLoadedStateValue = typeof stateValue.decisionLoaded;
export type DecisionLoadingStateValue = typeof stateValue.decisionLoading;
export type DecisionsLoadedStateValue = typeof stateValue.decisionsLoaded;
export type DecisionsLoadingStateValue = typeof stateValue.decisionsLoading;
export type OptionsStateValue = typeof stateValue.options;
export type RatingsStateValue = typeof stateValue.ratings;
export type RouteStateValue = typeof stateValue.route;
export type ResultsStateValue = typeof stateValue.results;
export type SignedInStateValue = typeof stateValue.signedIn;
export type SignedOutStateValue = typeof stateValue.signedOut;
export type SigningInStateValue = typeof stateValue.signingIn;

export const stateValue = {
  collaborators: {
    auth: { signedIn: { decision: { loaded: "collaborators" } } },
  },
  criteria: {
    auth: { signedIn: { decision: { loaded: "criteria" } } },
  },
  decisionLoaded: {
    auth: { signedIn: { decision: "loaded" } },
  },
  decisionLoading: {
    auth: { signedIn: { decision: "loading" } },
  },
  decisionsLoaded: {
    auth: { signedIn: { decisions: "loaded" } },
  },
  decisionsLoading: {
    auth: { signedIn: { decisions: "loading" } },
  },
  error: "error",
  options: {
    auth: { signedIn: { decision: { loaded: "options" } } },
  },
  preAuth: "preAuth",
  ratings: {
    auth: { signedIn: { decision: { loaded: "ratings" } } },
  },
  results: {
    auth: { signedIn: { decision: { loaded: "results" } } },
  },
  route: {
    auth: { signedIn: "route" },
  },
  signedIn: { auth: "signedIn" },
  signedOut: { auth: "signedOut" },
  signingIn: { auth: "signingIn" },
} as const;
