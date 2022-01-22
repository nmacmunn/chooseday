import "@testing-library/jest-dom";
import { render, RenderResult } from "@testing-library/svelte";
import { slotOptions } from "../helpers/slots";

jest.disableAutomock();

const SortableItem = () => require("../../src/components/sortable-item");

class Harness {
  data: any;
  result: RenderResult;
  get item() {
    return this.result.getByText("content");
  }
  render() {
    const data = this.data;
    this.result = render(SortableItem(), {
      data,
      ...slotOptions({
        default: "content",
      }),
    });
  }
}

describe("sortable item component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render the slot content", () => {
    harness.render();
    expect(harness.item).toBeVisible();
  });
  it("should have the class sortable-container if data is undefined", () => {
    harness.render();
    expect(harness.item).toHaveClass("sortable-container");
  });
  it("should attach data to the item", () => {
    harness.data = {};
    harness.render();
    expect(harness.item).toHaveProperty("data", harness.data);
  });
  it("should have the class sortable-item if data is defined", () => {
    harness.data = {};
    harness.render();
    expect(harness.item).toHaveClass("sortable-item");
  });
});
