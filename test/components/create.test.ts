import "@testing-library/jest-dom";
import { fireEvent, render, RenderResult } from "@testing-library/svelte";

jest.disableAutomock();

const Create = () => require("../../src/components/create");

class Harness {
  onSubmit = jest.fn();
  result: RenderResult;
  get createButton() {
    return this.result.getByLabelText("create");
  }
  get input() {
    return this.result.getByPlaceholderText("placeholder");
  }
  get label() {
    return this.result.getByText("label");
  }
  render() {
    this.result = render(Create(), {
      label: "label",
      onSubmit: this.onSubmit,
      placeholder: "placeholder",
    });
  }
  setInput(value: string) {
    return fireEvent.input(this.input, { target: { value } });
  }
  submitInput() {
    return fireEvent.submit(this.input);
  }
}

describe("create", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render the label", () => {
    harness.render();
    expect(harness.label).toBeVisible();
  });
  it("should render the create button", () => {
    harness.render();
    expect(harness.createButton).toBeVisible();
  });
  it("should render an input with the specified placeholder", () => {
    harness.render();
    expect(harness.input).toBeVisible();
  });
  it("should focus on the input", () => {
    harness.render();
    expect(harness.input).toHaveFocus();
  });
  it("should call onSubmit", async () => {
    harness.render();
    await harness.setInput("something");
    await harness.submitInput();
    expect(harness.onSubmit).toHaveBeenCalledWith("something");
  });
  it("should clear the input value on submit", async () => {
    harness.render();
    await harness.setInput("something");
    await harness.submitInput();
    expect(harness.input).toHaveValue("");
  });
});
