import { FakeDecision, FakeUser } from "../helpers/fake";
import { MachineHarness } from "../helpers/machine";

jest.unmock("lodash");
jest.unmock("../../src/util/name");
jest.unmock("../helpers/fake");
jest.unmock("../helpers/machine");

const runScript = () => jest.requireActual("../../src/util/results");

class Harness extends MachineHarness {}

describe("results util", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  describe("getOptionDescription", () => {
    it("should return 'Your top choice'", () => {
      harness.enter("results");
      const { decision, options, user } = harness.state.context;
      const result = runScript().getOptionDescription(
        options[0],
        {
          userId: {
            sorted: [{ options }],
            user,
          },
        },
        user,
        decision
      );
      expect(result).toEqual("Your top choice");
    });
    it("should return 'The creator's top choice'", () => {
      harness.enter("results");
      const { options, user } = harness.state.context;
      const creator = new FakeUser({ id: "creatorId" });
      const decision = new FakeDecision({ creator });
      const result = runScript().getOptionDescription(
        options[0],
        {
          creatorId: {
            sorted: [{ options }],
            user: creator,
          },
        },
        user,
        decision
      );
      expect(result).toEqual("The creator's top choice");
    });
    it("should return 'The top choice of you and the creator'", () => {
      harness.enter("results");
      const { options, user } = harness.state.context;
      const creator = new FakeUser({ id: "creatorId" });
      const decision = new FakeDecision({ creator });
      const result = runScript().getOptionDescription(
        options[0],
        {
          creatorId: {
            sorted: [{ options }],
            user: creator,
          },
          userId: {
            sorted: [{ options }],
            user,
          },
        },
        user,
        decision
      );
      expect(result).toEqual("Top choice of you and the creator");
    });
  });
  describe("processResults", () => {
    describe("byOption", () => {
      it("should return the results by option", () => {
        harness.enter("results");
        const result = runScript().processResults(harness.state.context);
        expect(result.byOption).toEqual({ option1: 0.5, option2: 0.5 });
      });
    });
    describe("byUser", () => {
      describe("byCriterion", () => {
        describe("byOption", () => {
          it("should return the results by option", () => {
            harness.enter("results");
            const result = runScript().processResults(harness.state.context);
            expect(
              result.byUser["userId"].byCriterion["criterion1"].byOption
            ).toEqual({
              option1: 0,
              option2: 0.5,
            });
            expect(
              result.byUser["userId"].byCriterion["criterion2"].byOption
            ).toEqual({
              option1: 0.5,
              option2: 0,
            });
          });
        });
        describe("criterion", () => {
          it("should return the criterion", () => {
            harness.enter("results");
            const result = runScript().processResults(harness.state.context);
            expect(
              result.byUser["userId"].byCriterion["criterion1"].criterion
            ).toEqual(harness.state.context.criteria[0]);
            expect(
              result.byUser["userId"].byCriterion["criterion2"].criterion
            ).toEqual(harness.state.context.criteria[1]);
          });
        });
        describe("sorted", () => {
          it("should return the sorted options", () => {
            harness.enter("results");
            const result = runScript().processResults(harness.state.context);
            expect(
              result.byUser["userId"].byCriterion["criterion1"].sorted
            ).toEqual([
              { options: [harness.state.context.options[1]], rank: 1 },
              { options: [harness.state.context.options[0]], rank: 2 },
            ]);
            expect(
              result.byUser["userId"].byCriterion["criterion2"].sorted
            ).toEqual([
              { options: [harness.state.context.options[0]], rank: 1 },
              { options: [harness.state.context.options[1]], rank: 2 },
            ]);
          });
        });
      });
      describe("byOption", () => {
        it("should return the results by option", () => {
          harness.enter("results");
          const result = runScript().processResults(harness.state.context);
          expect(result.byUser["userId"].byOption).toEqual({
            option1: 0.5,
            option2: 0.5,
          });
        });
      });
      describe("contribution", () => {
        it("should return the user's contribution by option", () => {
          harness.enter("results");
          const result = runScript().processResults(harness.state.context);
          expect(result.byUser["userId"].contribution).toEqual({
            option1: 0.5,
            option2: 0.5,
          });
        });
      });
      describe("sorted", () => {
        it("should return the sorted options", () => {
          harness.enter("results");
          const result = runScript().processResults(harness.state.context);
          expect(result.byUser["userId"].sorted).toEqual([
            {
              options: [
                harness.state.context.options[0],
                harness.state.context.options[1],
              ],
              rank: 1,
            },
          ]);
        });
      });
      describe("user", () => {
        it("should return the user", () => {
          harness.enter("results");
          const result = runScript().processResults(harness.state.context);
          expect(result.byUser["userId"].user).toEqual(
            harness.state.context.user
          );
        });
      });
    });
    describe("sorted", () => {
      it("should return the sorted options", () => {
        harness.enter("results");
        const result = runScript().processResults(harness.state.context);
        expect(result.sorted).toEqual([
          {
            options: [
              harness.state.context.options[0],
              harness.state.context.options[1],
            ],
            rank: 1,
          },
        ]);
      });
    });
  });
});
