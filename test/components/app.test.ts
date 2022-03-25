import "@testing-library/jest-dom";
import { render, RenderResult } from "@testing-library/svelte";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();
jest.unmock("svelte/internal");
jest.unmock("xstate");

const App = () => require("../../src/components/app.svelte");

class Harness extends MachineHarness {
  result: RenderResult;
  get body() {
    return this.result.getByText("Loading, please wait...");
  }
  get nav() {
    return this.result.getByText("Decisions");
  }
  get navbar() {
    return this.result.getByText("Chooseday");
  }
  get signIn() {
    return this.result.getByText("continue as guest");
  }
  render() {
    this.result = render(App());
  }
}

describe("App", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render the navbar", () => {
    harness.render();
    expect(harness.navbar).toBeVisible();
  });
  it("should render the sign in view", async () => {
    harness.enter("signedOut");
    harness.render();
    expect(harness.result.getByText("continue as a guest")).toBeVisible();
  });
  it("should render the nav", () => {
    harness.render();
    expect(harness.nav).toBeVisible();
  });
  it("should render the body", () => {
    harness.render();
    expect(harness.body).toBeVisible();
  });
});
