import { fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { act, render, RenderResult } from "@testing-library/svelte";

jest.disableAutomock();

const PromptModal = () => require("../../src/components/prompt-modal");

interface ComponentOptions {
  onSubmit: (value: string) => void;
  title: string;
  value?: string;
}

class Harness {
  result: RenderResult;
  constructor(public options: ComponentOptions) {}
  render() {
    this.result = render(PromptModal(), this.options);
  }
  get cancelButton() {
    return this.result.getByText("Cancel");
  }
  get input() {
    return this.result.getByLabelText(this.options.title);
  }
  get okButton() {
    return this.result.getByText("Ok");
  }
  clickCancelButton() {
    return fireEvent.click(this.cancelButton);
  }
  clickOkButton() {
    return fireEvent.click(this.okButton);
  }
  setInput(value: string) {
    return fireEvent.input(this.input, { target: { value } });
  }
  submitInput() {
    return fireEvent.submit(this.input);
  }
}

describe("prompt modal component", () => {
  let harness: Harness;
  beforeEach(() => {
    harness = new Harness({ onSubmit: jest.fn(), title: "Title" });
    jest.resetModules();
  });
  it("should render the title", async () => {
    harness.render();
    harness.result.component.$set({ title: "My Title" });
    await act();
    expect(harness.result.getByText("My Title")).toBeVisible();
  });
  it("should render an input", () => {
    harness.render();
    expect(harness.input).toBeVisible();
  });
  it("should call onSubmit when input is submitted", async () => {
    harness.render();
    await harness.setInput("value");
    await harness.submitInput();
    expect(harness.options.onSubmit).toHaveBeenCalledWith("value");
  });
  it("should render the cancel button", () => {
    harness.render();
    expect(harness.cancelButton).toBeVisible();
  });
  it("should render the ok button", () => {
    harness.render();
    expect(harness.okButton).toBeVisible();
  });
  it("should call onSubmit when ok is clicked", async () => {
    harness.render();
    await harness.setInput("value");
    await harness.clickOkButton();
    expect(harness.options.onSubmit).toHaveBeenCalledWith("value");
  });
  it("should show the component when show is called", () => {
    harness.render();
    harness.result.component.show();
  });
});
