import "@testing-library/jest-dom";
import { act, render, RenderResult } from "@testing-library/svelte";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();
jest.mock("chart.js/auto");

const Body = () => require("../../src/components/body.svelte");

class Harness extends MachineHarness {
  result: RenderResult;
  get loading() {
    return this.result.getByText("Loading, please wait...");
  }
  render() {
    this.result = render(Body());
  }
}

describe("Body", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render the loading spinner initially", () => {
    harness.render();
    expect(harness.loading).toBeVisible();
  });
  it("should render the loading spinner while signing in", async () => {
    harness.enter("signingIn");
    harness.render();
    expect(harness.loading).toBeVisible();
  });
  it("should render the loading spinner while routing", async () => {
    harness.enter("route");
    harness.render();
    expect(harness.loading).toBeVisible();
  });
  it("should render the loading spinner while loading decisions", async () => {
    harness.enter("decisionsLoading");
    harness.render();
    expect(harness.loading).toBeVisible();
  });
  it("should render the loading spinner while loading a decision", async () => {
    harness.enter("decisionLoading");
    harness.render();
    expect(harness.loading).toBeVisible();
  });
  it("should render the sign in view", async () => {
    harness.enter("signedOut");
    harness.render();
    expect(harness.result.getByText("continue as a guest")).toBeVisible();
  });
  it("should render the decisions view", async () => {
    harness.enter("decisionsLoaded");
    harness.render();
    expect(harness.result.getByText("Create a decision")).toBeVisible();
  });
  it("should render the options view", async () => {
    harness.enter("options");
    harness.render();
    expect(harness.result.getByText("Create an option")).toBeVisible();
  });
  it("should render the criteria view", async () => {
    harness.enter("criteria");
    harness.render();
    expect(harness.result.getByText("Add criteria")).toBeVisible();
  });
  it("should render the ratings view", async () => {
    harness.enter("ratings");
    harness.render();
    expect(harness.result.getByText("Sort by")).toBeVisible();
  });
  it("should render the collaborators view", async () => {
    harness.enter("collaborators");
    harness.render();
    expect(
      harness.result.getByText("Share this link to invite collaborators")
    ).toBeVisible();
  });
  it("should render the results view", async () => {
    harness.enter("results");
    harness.render();
    expect(harness.result.getByText("Best overall")).toBeVisible();
  });
});
