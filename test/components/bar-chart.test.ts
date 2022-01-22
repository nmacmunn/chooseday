import "@testing-library/jest-dom";
import { act, render, RenderResult } from "@testing-library/svelte";

jest.disableAutomock();
jest.mock("chart.js/auto");

const BarChart = () => require("../../src/components/bar-chart.svelte");
const Chart = () => require("chart.js/auto");

class Harness {
  datasets = [];
  label = "My Chart";
  labels = [];
  options = {};
  result: RenderResult;
  get canvas() {
    return this.result.getByLabelText("My Chart");
  }
  render() {
    this.result = render(BarChart(), {
      datasets: this.datasets,
      label: this.label,
      labels: this.labels,
      options: this.options,
    });
  }
}

describe("bar chart component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render a canvas", () => {
    harness.render();
    expect(harness.canvas).toBeVisible();
  });
  it("should create a new chart", () => {
    harness.render();
    expect(Chart().default).toHaveBeenCalledWith(harness.canvas, {
      type: "bar",
      data: {
        datasets: [],
        labels: [],
      },
      options: {},
    });
  });
  it("should update the chart when the dataset changes", async () => {
    const chart = { data: {}, update: jest.fn() };
    Chart().default.getChart.mockReturnValue(chart);
    harness.render();
    harness.result.component.$set({ datasets: [] });
    await act();
    expect(chart.update).toHaveBeenCalled();
  });
});
