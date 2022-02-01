import "@testing-library/jest-dom";
import { act, render, RenderResult } from "@testing-library/svelte";
import type { Result } from "../../src/model/result";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();
jest.mock("chart.js/auto");

const ResultsOverall = () => require("../../src/components/results-overall");

class Harness extends MachineHarness {
  processed: Result;
  result: RenderResult;
  render() {
    const state = this.state;
    this.result = render(ResultsOverall(), { state });
  }
  async refresh() {
    const state = this.state;
    this.result.component.$set({ state });
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
    expect(harness.result.getByText("75")).toBeVisible();
    expect(harness.result.getByText("25")).toBeVisible();
  });
  it("should indicate your top choice", () => {
    harness.enter("results");
    harness.render();
    expect(
      harness.result.getByText("Top choice of you and pal@example.com")
    ).toBeVisible();
  });
  it("should render a bar chart", () => {
    harness.enter("results");
    harness.render();
    expect(harness.barChart).toBeVisible();
  });
});
