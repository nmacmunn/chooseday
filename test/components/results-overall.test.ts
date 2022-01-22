import "@testing-library/jest-dom";
import { act, render, RenderResult } from "@testing-library/svelte";
import { ResultsContext } from "../../src/types/context";
import type { Processed } from "../../src/util/results";
import { processResults } from "../../src/util/results";
import { FakeCriterion } from "../helpers/fake";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();
jest.mock("chart.js/auto");

const ResultsOverall = () => require("../../src/components/results-overall");

class Harness extends MachineHarness {
  processed: Processed;
  result: RenderResult;
  render() {
    const state = this.state;
    const processed = (this.processed = processResults(
      state.context as ResultsContext
    ));
    this.result = render(ResultsOverall(), { processed, state });
  }
  async refresh() {
    const state = this.state;
    const processed = (this.processed = processResults(
      state.context as ResultsContext
    ));
    this.result.component.$set({ processed, state });
    await act();
  }
  get barChart() {
    return this.result.getByLabelText("Overall results chart");
  }
  get firstOptionTitle() {
    return this.result.getByText("First Option");
  }
  get secondOptionTitle() {
    return this.result.getByText("Second Option");
  }
}

describe("results overall component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render each option's title", () => {
    harness.enter("results");
    harness.render();
    expect(harness.firstOptionTitle).toBeVisible();
    expect(harness.secondOptionTitle).toBeVisible();
  });
  it("should render each option's score", () => {
    harness.enter("results");
    harness.render();
    expect(harness.result.getAllByText("50")).toHaveLength(2);
  });
  it("should indicate your top choice", () => {
    harness.enter("results");
    // break the tie
    harness.sendCriteriaLoaded([
      new FakeCriterion({
        id: "criterion1",
        title: "First Criterion",
        weight: 1,
      }),
      new FakeCriterion({
        id: "criterion2",
        title: "Second Criterion",
        weight: 2,
      }),
    ]);
    harness.render();
    expect(harness.result.getByText("Your top choice")).toBeVisible();
  });
  it("should render a bar chart", () => {
    harness.enter("results");
    harness.render();
    expect(harness.barChart).toBeVisible();
  });
});
