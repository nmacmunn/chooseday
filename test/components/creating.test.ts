import "@testing-library/jest-dom";
import { act, render, RenderResult } from "@testing-library/svelte";
import { FakeDecision } from "../helpers/fake";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();

const Creating = () => require("../../src/components/creating");

class Harness extends MachineHarness {
  result: RenderResult;
  render() {
    this.result = render(Creating(), { state: this.state });
  }
  refresh() {
    this.result.component.$set({ state: this.state });
    return act();
  }
  get loading() {
    return this.result.getByText("Creating your decision, please wait...");
  }
}

describe("creating component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render a loading message", () => {
    harness.enter("creating");
    harness.render();
    expect(harness.loading).toBeVisible();
  });
  it("should enter decision loading when the decision appears", async () => {
    harness.enter("creating");
    harness.render();
    harness.sendCreatorDecisionsLoaded([new FakeDecision()]);
    await harness.refresh();
    expect(harness.state.value).toEqual({
      auth: { signedIn: { decision: "loading" } },
    });
  });
});
