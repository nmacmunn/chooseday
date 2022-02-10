import type {
  Criterion,
  Decision,
  Option,
  Rating,
  User,
} from "../../src/types/data";
import type { AppState } from "../../src/types/state";
import type { StateName } from "../../src/util/state-value";
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
    if (stateName === "route") {
      return;
    }
    if (stateName === "decisionsLoading") {
      this.sendDecisions();
      return;
    }
    if (stateName === "decisionsLoaded") {
      this.sendDecisions();
      this.sendCollaboratorDecisionsLoaded();
      this.sendCreatorDecisionsLoaded();
      return;
    }
    this.sendLoad();
    if (stateName === "decisionLoading") {
      return;
    }
    this.sendDecisionLoaded();
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
    const collaborator = new FakeUser({
      id: "collaborator",
      email: "pal@example.com",
    });
    this.sendCriteriaLoaded([
      new FakeCriterion({ id: "criterion1", title: "First Criterion" }),
      new FakeCriterion({ id: "criterion2", title: "Second Criterion" }),
      new FakeCriterion({
        id: "criterion3",
        title: "Third Criterion",
        weight: 1,
        user: collaborator,
      }),
      new FakeCriterion({
        id: "criterion4",
        title: "Fourth Criterion",
        weight: 2,
        user: collaborator,
      }),
    ]);
    this.sendRatingsLoaded([
      new FakeRating({ criterionId: "criterion1", optionId: "option1" }),
      new FakeRating({ criterionId: "criterion1", optionId: "option2" }),
      new FakeRating({ criterionId: "criterion2", optionId: "option1" }),
      new FakeRating({ criterionId: "criterion2", optionId: "option2" }),
      new FakeRating({
        criterionId: "criterion3",
        optionId: "option1",
        user: collaborator,
      }),
      new FakeRating({
        criterionId: "criterion3",
        optionId: "option2",
        user: collaborator,
      }),
      new FakeRating({
        criterionId: "criterion4",
        optionId: "option1",
        user: collaborator,
      }),
      new FakeRating({
        criterionId: "criterion4",
        optionId: "option2",
        user: collaborator,
      }),
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
      new FakeRating({
        criterionId: "criterion3",
        optionId: "option1",
        weight: 2,
        user: collaborator,
      }),
      new FakeRating({
        criterionId: "criterion3",
        optionId: "option2",
        weight: 1,
        user: collaborator,
      }),
      new FakeRating({
        criterionId: "criterion4",
        optionId: "option1",
        weight: 2,
        user: collaborator,
      }),
      new FakeRating({
        criterionId: "criterion4",
        optionId: "option2",
        weight: 1,
        user: collaborator,
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
  sendDecisionLoaded(decision: Decision = new FakeDecision()) {
    Machine().send({ type: "DECISIONLOADED", decision });
  }
  sendError(error: string = "error") {
    Machine().send({ type: "ERROR", error });
  }
  sendLoad(decisionId = "decisionId") {
    Machine().send({ type: "LOAD", decisionId });
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
