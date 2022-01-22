import type {
  Criterion,
  Decision,
  Option,
  Rating,
  User,
} from "../../src/types/data";
import type { AppState } from "../../src/types/state";
import {
  FakeCriterion,
  FakeDecision,
  FakeOption,
  FakeRating,
  FakeUser,
} from "./fake";

// control which machine dependencies are mocked regardless of whether
// automock is enabled
jest.unmock("./fake");
jest.unmock("svelte/store");
jest.unmock("xstate");
jest.unmock("../../src/util/action");
jest.unmock("../../src/util/guard");
jest.mock("../../src/util/service");

const Machine = () => jest.requireActual("../../src/machine");

type StateName =
  | "error"
  | "signingIn"
  | "signedOut"
  | "decisionsLoading"
  | "decisionsLoaded"
  | "creating"
  | "decisionLoading"
  | "options"
  | "criteria"
  | "ratings"
  | "collaborators"
  | "results";

export class MachineHarness {
  state: AppState;

  constructor() {
    Machine().state.subscribe((state) => (this.state = state));
  }

  enter(stateName: StateName) {
    if (stateName === "error") {
      this.sendError();
      return;
    }
    this.sendRedirectResult();
    if (stateName === "signingIn") {
      return;
    }
    if (stateName === "signedOut") {
      this.sendSignOut();
      return;
    }
    this.sendSignIn();
    if (stateName === "decisionsLoading") {
      return;
    }
    this.sendCollaboratorDecisionsLoaded();
    this.sendCreatorDecisionsLoaded();
    if (stateName === "decisionsLoaded") {
      return;
    }
    if (stateName === "creating") {
      this.sendCreating();
      return;
    }
    this.sendDecision();
    if (stateName === "decisionLoading") {
      return;
    }
    this.sendCriteriaLoaded();
    this.sendOptionsLoaded();
    this.sendRatingsLoaded();
    if (stateName === "options") {
      this.sendOptions();
      return;
    }
    this.sendOptionsLoaded([
      new FakeOption({ id: "option1", title: "First Option" }),
      new FakeOption({ id: "option2", title: "Second Option" }),
    ]);
    if (stateName === "criteria") {
      this.sendCriteria();
      return;
    }
    this.sendCriteriaLoaded([
      new FakeCriterion({ id: "criterion1", title: "First Criterion" }),
      new FakeCriterion({ id: "criterion2", title: "Second Criterion" }),
    ]);
    this.sendRatingsLoaded([
      new FakeRating({ criterionId: "criterion1", optionId: "option1" }),
      new FakeRating({ criterionId: "criterion1", optionId: "option2" }),
      new FakeRating({ criterionId: "criterion2", optionId: "option1" }),
      new FakeRating({ criterionId: "criterion2", optionId: "option2" }),
    ]);
    if (stateName === "ratings") {
      this.sendRatings();
      return;
    }
    this.sendRatingsLoaded([
      new FakeRating({
        criterionId: "criterion1",
        optionId: "option1",
        weight: 1,
      }),
      new FakeRating({
        criterionId: "criterion1",
        optionId: "option2",
        weight: 2,
      }),
      new FakeRating({
        criterionId: "criterion2",
        optionId: "option1",
        weight: 2,
      }),
      new FakeRating({
        criterionId: "criterion2",
        optionId: "option2",
        weight: 1,
      }),
    ]);
    if (stateName === "collaborators") {
      this.sendCollaborators();
      return;
    }
    this.sendResults();
  }
  sendCollaborators() {
    Machine().send({ type: "COLLABORATORS" });
  }
  sendCollaboratorDecisionsLoaded(decisions: Decision[] = []) {
    Machine().send({ type: "COLLABORATORDECISIONSLOADED", decisions });
  }
  sendCreating(decisionId = "decisionId") {
    Machine().send({ type: "CREATING", decisionId });
  }
  sendCreatorDecisionsLoaded(decisions: Decision[] = []) {
    Machine().send({ type: "CREATORDECISIONSLOADED", decisions });
  }
  sendCriteriaLoaded(criteria: Criterion[] = []) {
    Machine().send({ type: "CRITERIALOADED", criteria });
  }
  sendCriteria() {
    Machine().send({ type: "CRITERIA" });
  }
  sendCriterion(criterion: Criterion) {
    Machine().send({ type: "CRITERION", criterion });
  }
  sendDecisions() {
    Machine().send({ type: "DECISIONS" });
  }
  sendDecision(decision: Decision = new FakeDecision()) {
    Machine().send({ type: "DECISION", decision });
  }
  sendError(error: string = "error") {
    Machine().send({ type: "ERROR", error });
  }
  sendOptions() {
    Machine().send({ type: "OPTIONS" });
  }
  sendOptionsLoaded(options: Option[] = []) {
    Machine().send({ type: "OPTIONSLOADED", options });
  }
  sendRatings() {
    Machine().send({ type: "RATINGS" });
  }
  sendRatingsLoaded(ratings: Rating[] = []) {
    Machine().send({ type: "RATINGSLOADED", ratings });
  }
  sendRedirectResult() {
    Machine().send({ type: "REDIRECTRESULT" });
  }
  sendResults() {
    Machine().send({ type: "RESULTS" });
  }
  sendSignIn(user: User = new FakeUser()) {
    Machine().send({ type: "SIGNIN", user });
  }
  sendSignOut() {
    Machine().send({ type: "SIGNOUT" });
  }
}