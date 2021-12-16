import type {
  Criterion,
  Decision,
  Option,
  Rating,
  User,
} from "../src/types/data";
import type { RatingsContext } from "../src/types/context";

export interface FakeCriterion extends Criterion {}
export class FakeCriterion {
  constructor(data: Partial<Criterion> = {}) {
    Object.assign(
      this,
      {
        decisionId: "decisionId",
        id: "criterionId",
        title: "criterion title",
        user: { id: "userId" },
        weight: 1,
      },
      data
    );
  }
}

export interface FakeDecision extends Decision {}
export class FakeDecision {
  constructor(data: Partial<Decision> = {}) {
    Object.assign(
      this,
      {
        created: 0,
        creator: { id: "userId" },
        collaborators: [],
        id: "decisionId",
        title: "decision title",
      },
      data
    );
  }
}

export interface FakeOption extends Option {}
export class FakeOption {
  constructor(data: Partial<Decision> = {}) {
    Object.assign(
      this,
      {
        created: 0,
        decisionId: "decisionId",
        id: "optionId",
        title: "option title",
      },
      data
    );
  }
}

export interface FakeRating extends Rating {}
export class FakeRating {
  constructor(data: Partial<Rating> = {}) {
    Object.assign(
      this,
      {
        criterionId: "criterionId",
        decisionId: "decisionId",
        id: "ratingId",
        optionId: "optionId",
        user: { id: "userId" },
        weight: 1,
      },
      data
    );
  }
}

export interface FakeUser extends User {}
export class FakeUser {
  constructor(data: Partial<User> = {}) {
    Object.assign(
      this,
      {
        id: "userId",
      },
      data
    );
  }
}

export interface FakeRatingsContext extends RatingsContext {}
export class FakeRatingsContext implements RatingsContext {
  constructor(data: Partial<RatingsContext> = {}) {
    Object.assign(
      this,
      {
        criteria: [
          new FakeCriterion({ id: "criterion1" }),
          new FakeCriterion({ id: "criterion2" }),
        ],
        criterion: new FakeCriterion({ id: "criterion1" }),
        decision: new FakeDecision(),
        options: [
          new FakeOption({ id: "option1" }),
          new FakeOption({ id: "option2" }),
        ],
        ratings: [
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
            weight: 3,
          }),
          new FakeRating({
            criterionId: "criterion2",
            optionId: "option2",
            weight: 4,
          }),
        ],
        user: new FakeUser(),
      },
      data
    );
  }
}

export class FakeTransaction {
  delete = jest.fn(() => ({}));
  set = jest.fn(() => ({}));
  update = jest.fn(() => ({}));
}
