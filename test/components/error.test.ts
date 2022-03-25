import "@testing-library/jest-dom";
import { fireEvent, render, RenderResult } from "@testing-library/svelte";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();

const Error = () => require("../../src/components/error");

class Harness extends MachineHarness {
  result: RenderResult;
  render() {
    this.result = render(Error(), { state: this.state });
  }
  get button() {
    return this.result.getByText("Home");
  }
  get heading() {
    return this.result.getByText("Oh no!");
  }
  get message() {
    return this.result.getByText("error");
  }
  clickButton() {
    return fireEvent.click(this.button);
  }
}

describe("error component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render a heading", () => {
    harness.enter("error");
    harness.render();
    expect(harness.heading).toBeVisible();
  });
  it("should render a message", () => {
    harness.enter("error");
    harness.render();
    expect(harness.message).toBeVisible();
  });
  it("should render a home button", () => {
    harness.enter("error");
    harness.render();
    expect(harness.button).toBeVisible();
  });
  it("should go to auth state when home button is clicked", async () => {
    harness.enter("error");
    harness.render();
    await harness.clickButton();
    expect(harness.state.value).toEqual({
      auth: "signingIn",
    });
  });
});
