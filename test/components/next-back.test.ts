import "@testing-library/jest-dom";
import { render, fireEvent, RenderResult } from "@testing-library/svelte";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();

const NextBack = () => require("../../src/components/next-back");

class Harness extends MachineHarness {
  result: RenderResult;
  render(options: any) {
    this.result = render(NextBack(), options);
  }
  get backButton() {
    return this.result.getByText("Back");
  }
  get nextButton() {
    return this.result.getByText("Next");
  }
  clickBackButton() {
    return fireEvent.click(this.backButton);
  }
  clickNextButton() {
    return fireEvent.click(this.nextButton);
  }
}

describe("next-back component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render the back button if back is specified", () => {
    harness.render({
      back: { label: "Back", event: { type: "ERROR", error: "" } },
      next: { label: "Next", event: { type: "ERROR", error: "" } },
    });
    expect(harness.backButton).toBeVisible();
  });
  it("should not render the back button if back is not specified", () => {
    harness.render({
      next: { label: "Next", event: { type: "ERROR", error: "" } },
    });
    expect(() => harness.backButton).toThrow();
  });
  it("should change states when the back button is pressed", async () => {
    harness.render({
      back: { label: "Back", event: { type: "ERROR", error: "" } },
      next: { label: "Next", event: { type: "ERROR", error: "" } },
    });
    await harness.clickBackButton();
    expect(harness.state.value).toEqual("error");
  });
  it("should render the next button if next is specified", () => {
    harness.render({
      back: { label: "Back", event: { type: "ERROR", error: "" } },
      next: { label: "Next", event: { type: "ERROR", error: "" } },
    });
    expect(harness.nextButton).toBeVisible();
  });
  it("should not render the next button if next is not specified", () => {
    harness.render({
      back: { label: "Back", event: { type: "ERROR", error: "" } },
    });
    expect(() => harness.nextButton).toThrow();
  });
  it("should change states when the next button is pressed", async () => {
    harness.render({
      back: { label: "Back", event: { type: "ERROR", error: "" } },
      next: { label: "Next", event: { type: "ERROR", error: "" } },
    });
    await harness.clickNextButton();
    expect(harness.state.value).toEqual("error");
  });
});
