import { FakeDecision, FakeOption, FakeUser } from "../helpers/fake";
import { MachineHarness } from "../helpers/machine";

jest.unmock("lodash");
jest.unmock("../../src/model/result");
jest.unmock("../../src/model/result-builder");
jest.unmock("../../src/model/result-preprocessor");
jest.unmock("../../src/util/name");
jest.unmock("../helpers/fake");
jest.unmock("../helpers/machine");

const runScript = () => jest.requireActual("../../src/util/result");

class Harness extends MachineHarness {}

describe("result util", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  describe("getResult", () => {
    it("should return undefined if context is invalid", () => {
      const result = runScript().getResult({});
      expect(result).toBeUndefined();
    });
    it("should return a Result", () => {
      harness.enter("results");
      const result = runScript().getResult(harness.state.context);
      expect(result).toBeInstanceOf(require("../../src/model/result").Result);
    });
    describe("result", () => {
      it("should return the overall results", () => {
        harness.enter("results");
        const result = runScript().getResult(harness.state.context);
        expect(result.getOverall()).toEqual([
          {
            ...harness.state.context.options[0],
            score: 0.75,
            rank: 1,
          },
          {
            ...harness.state.context.options[1],
            score: 0.25,
            rank: 2,
          },
        ]);
      });
      it("should return the results by user", () => {
        harness.enter("results");
        const result = runScript().getResult(harness.state.context);
        expect(result.getUser({ id: "userId" })).toEqual([
          {
            ...harness.state.context.options[1],
            score: 0.25,
            rank: 1,
          },
          {
            ...harness.state.context.options[0],
            score: 0.25,
            rank: 1,
          },
        ]);
        expect(result.getUser({ id: "collaborator" })).toEqual([
          {
            ...harness.state.context.options[0],
            score: 0.5,
            rank: 1,
          },
          {
            ...harness.state.context.options[1],
            score: 0,
            rank: 2,
          },
        ]);
      });
    });
  });
});
