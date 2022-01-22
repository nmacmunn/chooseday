import "@testing-library/jest-dom";
import { render, RenderResult } from "@testing-library/svelte";
import { slotOptions } from "../helpers/slots";

jest.disableAutomock();

const SortableList = () => require("../../src/components/sortable-list");

const listItems = `<li class="sortable-item">first</li>
<li class="sortable-container">
  <ul>
    <li class="sortable-item">second - 1</li>
    <li class="sortable-item">second - 2</li>
  </ul>
</li>
<li class="sortable-item">fourth</li>`;

class Harness {
  result: RenderResult;
  get firstItem() {
    return this.result.getByText("first");
  }
  render() {
    this.result = render(SortableList(), {
      ...slotOptions({
        default: listItems,
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
    expect(harness.firstItem).toBeVisible();
  });
  it("should export a sorted function", () => {
    harness.render();
    expect(harness.result.component.sorted()).toEqual([
      [undefined],
      [undefined, undefined],
      [undefined],
    ]);
  });
  it.skip("should fire a sorted event when an item is dragged", (done) => {
    harness.render();
    harness.result.component.$on("sorted", () => done());
    // drag the first element
  });
});
