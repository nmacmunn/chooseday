import "@testing-library/jest-dom";
import { act, render, RenderResult } from "@testing-library/svelte";
import { ResultsContext } from "../../src/types/context";
import type { Processed } from "../../src/util/results";
import { processResults } from "../../src/util/results";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();
jest.mock("chart.js/auto");

const ResultsUser = () => require("../../src/components/results-user");

class Harness extends MachineHarness {
  processed: Processed;
  result: RenderResult;
  render() {
    const state = this.state;
    const processed = (this.processed = processResults(
      state.context as ResultsContext
    ));
    this.result = render(ResultsUser(), { processed, state });
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
    return this.result.getByLabelText("User results chart");
  }
  get firstOptionTitle() {
    return this.result.getByText("First Option");
  }
  get secondOptionTitle() {
    return this.result.getByText("Second Option");
  }
}

describe("results user component", () => {
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
  it("should indicate your top choice be each criteria", () => {
    harness.enter("results");
    harness.render();
    expect(harness.result.getByText("Best for First Criterion")).toBeVisible();
    expect(harness.result.getByText("Best for Second Criterion")).toBeVisible();
  });
  it("should render a bar chart", () => {
    harness.enter("results");
    harness.render();
    expect(harness.barChart).toBeVisible();
  });
});
