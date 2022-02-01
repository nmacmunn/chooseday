import "@testing-library/jest-dom";
import { act, fireEvent, render, RenderResult } from "@testing-library/svelte";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();
jest.mock("chart.js/auto");

const Results = () => require("../../src/components/results");

class Harness extends MachineHarness {
  result: RenderResult;
  render() {
    const state = this.state;
    this.result = render(Results(), { state });
  }
  get collaboratorsButton() {
    return this.result.getByText("Collaborators");
  }
  get collaboratorTab() {
    return this.result.getByText("pal@example.com");
  }
  get youTab() {
    return this.result.getByText("you");
  }
  clickCollaboratorsButton() {
    return fireEvent.click(this.collaboratorsButton);
  }
  clickCollaboratorTab() {
    return fireEvent.click(this.collaboratorTab);
  }
  clickYouTab() {
    return fireEvent.click(this.youTab);
  }
  async refresh() {
    const state = this.state;
    this.result.component.$set({ state });
    await act();
  }
}

describe("results component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render 'Best overall'", () => {
    harness.enter("results");
    harness.render();
    expect(harness.result.getByText("Best overall")).toBeVisible();
  });
  it("should render the overall results chart", () => {
    harness.enter("results");
    harness.render();
    expect(
      harness.result.getByLabelText("Overall results chart")
    ).toBeVisible();
  });
  it("should render 'Results by collaborator'", () => {
    harness.enter("results");
    harness.render();
    expect(harness.result.getByText("Results by collaborator")).toBeVisible();
  });
  it("should render a tab for each user", () => {
    harness.enter("results");
    harness.render();
    expect(harness.youTab).toBeVisible();
    expect(harness.collaboratorTab).toBeVisible();
  });
  it("should render user results when you tab is clicked", async () => {
    harness.enter("results");
    harness.render();
    await harness.clickYouTab();
    expect(harness.result.getByText("Best for First Criterion")).toBeVisible();
    expect(harness.result.getByText("Best for Second Criterion")).toBeVisible();
  });
  it("should render collaborat results when collaborator tab is clicked", async () => {
    harness.enter("results");
    harness.render();
    await harness.clickCollaboratorTab();
    expect(
      harness.result.getByText("Best for Third Criterion, Fourth Criterion")
    ).toBeVisible();
  });
  it("should render the overall results chart", () => {
    harness.enter("results");
    harness.render();
    expect(harness.result.getByLabelText("User results chart")).toBeVisible();
  });
  it("should render the collaborators button", () => {
    harness.enter("results");
    harness.render();
    expect(harness.collaboratorsButton).toBeVisible();
  });
  it("should go back to collaborators when button is clicked", async () => {
    harness.enter("results");
    harness.render();
    await harness.clickCollaboratorsButton();
    expect(harness.state.value).toEqual({
      auth: { signedIn: { decision: { loaded: "collaborators" } } },
    });
  });
});
