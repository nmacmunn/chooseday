import {
  FakeCriterion,
  FakeDecision,
  FakeOption,
  FakeUser,
} from "../helpers/fake";
import type { Result } from "../../src/model/result";
import { CriterionReady, UserReady } from "../../src/types/result";
import { Criterion, Option, User } from "../../src/types/data";

jest.unmock("lodash");
jest.unmock("../helpers/fake");
jest.unmock("../../src/util/name");

const runScript = () => jest.requireActual("../../src/model/result");

const options = [
  new FakeOption({ id: "option1" }),
  new FakeOption({ id: "option2" }),
];
const users = [
  { id: "userId", normalized: 0.5 },
  { id: "collaborator", normalized: 0.5 },
];
const criteria = [
  {
    ...new FakeCriterion({ id: "criterion1", title: "first" }),
    normalized: 0.5,
  },
  {
    ...new FakeCriterion({ id: "criterion2", title: "second" }),
    normalized: 0.5,
  },
  {
    ...new FakeCriterion({ id: "criterion3", title: "third", user: users[1] }),
    normalized: 0.5,
  },
  {
    ...new FakeCriterion({ id: "criterion4", title: "fourth", user: users[1] }),
    normalized: 0.5,
  },
];

class Harness {
  user = users[0];
  decision = new FakeDecision();
  criterionResults = [
    {
      ...criteria[0],
      results: [
        { ...options[1], rank: 1, score: 0.5 },
        { ...options[0], rank: 2, score: 0 },
      ],
    },
    {
      ...criteria[1],
      results: [
        { ...options[1], rank: 1, score: 0.5 },
        { ...options[0], rank: 2, score: 0 },
      ],
    },
    {
      ...criteria[2],
      results: [
        { ...options[1], rank: 1, score: 0.5 },
        { ...options[0], rank: 2, score: 0 },
      ],
    },
    {
      ...criteria[3],
      results: [
        { ...options[0], rank: 1, score: 0.5 },
        { ...options[1], rank: 2, score: 0 },
      ],
    },
  ];
  userResults = [
    {
      ...users[0],
      results: [
        { ...options[1], rank: 1, score: 0.5 },
        { ...options[0], rank: 2, score: 0 },
      ],
    },
    {
      ...users[1],
      results: [
        { ...options[1], rank: 1, score: 0.25 },
        { ...options[0], rank: 1, score: 0.25 },
      ],
    },
  ];
  optionResults = [
    { ...options[1], rank: 1, score: 0.75 },
    { ...options[0], rank: 2, score: 0.25 },
  ];
  result: Result;
  private ensureResult() {
    if (!this.result) {
      this.create();
    }
  }
  create() {
    const { Result } = runScript();
    this.result = new Result(
      this.user,
      this.decision,
      this.criterionResults,
      this.userResults,
      this.optionResults
    );
  }
  criterionIsDone(criterion: Criterion) {
    this.ensureResult();
    return this.result.criterionIsDone(criterion);
  }
  getCriterionDatasets(user: User) {
    this.ensureResult();
    return this.result.getCriterionDatasets(user);
  }
  getDoneUsers() {
    this.ensureResult();
    return this.result.getDoneUsers();
  }
  getOverall() {
    this.ensureResult();
    return this.result.getOverall();
  }
  getOverallOptionDescription(option: Option) {
    this.ensureResult();
    return this.result.getOverallOptionDescription(option);
  }
  getUserOptionDescription(option: Option, user: User) {
    this.ensureResult();
    return this.result.getUserOptionDescription(option, user);
  }
  getUser(user: User) {
    this.ensureResult();
    return this.result.getUser(user);
  }
  getUserDatasets() {
    this.ensureResult();
    return this.result.getUserDatasets();
  }
  userIsDone(user: User) {
    this.ensureResult();
    return this.result.userIsDone(user);
  }
}

describe("result model", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  describe("criterionIsDone", () => {
    it("should be false if the specified criterion is not found", () => {
      const result = harness.criterionIsDone(
        new FakeCriterion({ id: "criterion5" })
      );
      expect(result).toBe(false);
    });
    it("should be false if the specified criterion's results are undefined", () => {
      harness.criterionResults[0].results = undefined;
      const result = harness.criterionIsDone(criteria[0]);
      expect(result).toBe(false);
    });
    it("should be true if the specified criterion's results are defined", () => {
      const result = harness.criterionIsDone(criteria[0]);
      expect(result).toBe(true);
    });
  });
  describe("getCriterionDatasets", () => {
    it("should return an empty array if the user is not recognized", () => {
      const user = new FakeUser({ id: "joe" });
      const result = harness.getCriterionDatasets(user);
      expect(result).toEqual([]);
    });
    it("should return chart datasets for the specified user", () => {
      const result = harness.getCriterionDatasets(users[0]);
      expect(result).toEqual([
        {
          data: [0, 0.5],
          label: "first",
        },
        {
          data: [0, 0.5],
          label: "second",
        },
      ]);
    });
  });
  describe("getDoneUsers", () => {
    it("should return an array of users with results", () => {
      harness.userResults[1].results = undefined;
      const result = harness.getDoneUsers();
      expect(result).toEqual([harness.userResults[0]]);
    });
  });
  describe("getUserDatasets", () => {
    it("should return chart datasets for all users", () => {
      const result = harness.getUserDatasets();
      expect(result).toEqual([
        {
          data: [0, 0.5],
          label: "you",
        },
        {
          data: [0.25, 0.25],
          label: "a collaborator",
        },
      ]);
    });
  });
  describe("getOverallOptionDescription", () => {
    it("should return an empty string if specified option is not top for any user", () => {
      const result = harness.getOverallOptionDescription(
        new FakeOption({ id: "option3" })
      );
      expect(result).toEqual("");
    });
    it("should return the top choice of a single user", () => {
      const result = harness.getOverallOptionDescription(options[0]);
      expect(result).toEqual("A collaborator's top choice");
    });
    it("should return the top choice of multiple users", () => {
      const result = harness.getOverallOptionDescription(options[1]);
      expect(result).toEqual("Top choice of you and a collaborator");
    });
  });
  describe("getUserOptionDescription", () => {
    it("should return an empty string if the specified user is not recognized", () => {
      const result = harness.getUserOptionDescription(
        options[0],
        new FakeUser({ id: "joe" })
      );
      expect(result).toEqual("");
    });
    it("should return an empty string it the specified option is not best for any criterion", () => {
      const result = harness.getUserOptionDescription(options[0], users[0]);
      expect(result).toEqual("");
    });
    it("should return one criterion the specified option is best for", () => {
      const result = harness.getUserOptionDescription(options[0], users[1]);
      expect(result).toEqual("Best for fourth");
    });
    it("should return multiple criteria the specified option is best for", () => {
      const result = harness.getUserOptionDescription(options[1], users[0]);
      expect(result).toEqual("Best for first, second");
    });
  });
  describe("getUser", () => {
    it("should return an empty array if the user is not recognized", () => {
      const user = new FakeUser({ id: "joe" });
      const result = harness.getUser(user);
      expect(result).toEqual([]);
    });
    it("should return an empty array if the user is not done rating", () => {
      harness.userResults[0].results = undefined;
      const result = harness.getUser(users[0]);
      expect(result).toEqual([]);
    });
    it("should return the results for the specified user", () => {
      const result = harness.getUser(users[0]);
      expect(result).toEqual(harness.userResults[0].results);
    });
  });
  describe("getOverall", () => {
    it("should return option results", () => {
      const result = harness.getOverall();
      expect(result).toEqual(harness.optionResults);
    });
  });
  describe("userIsDone", () => {
    it("should return false if the user is not recognized", () => {
      const user = new FakeUser({ id: "joe" });
      const result = harness.userIsDone(user);
      expect(result).toBe(false);
    });
    it("should return false if the user is not done rating", () => {
      harness.userResults[0].results = undefined;
      const result = harness.userIsDone(users[0]);
      expect(result).toBe(false);
    });
    it("should return true if user is done rating", () => {
      const result = harness.userIsDone(users[0]);
      expect(result).toBe(true);
    });
  });
});
