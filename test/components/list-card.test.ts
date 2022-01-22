import { fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import { slotOptions } from "../helpers/slots";

jest.disableAutomock();

const ListCard = () => require("../../src/components/list-card");

describe("list card component", () => {
  beforeEach(() => jest.resetModules());
  it("should render the left slot", () => {
    const result = render(ListCard(), {
      ...slotOptions({
        left: "Vacation",
        right: "<button />",
      }),
    });
    expect(result.getByText("Vacation")).toBeVisible();
  });
  it("should call onClick when left click ", async () => {
    const onClick = jest.fn();
    const result = render(ListCard(), {
      onClick,
      ...slotOptions({
        left: "Vacation",
        right: "<button />",
      }),
    });
    const title = result.getByText("Vacation");
    await fireEvent.click(title);
    expect(onClick).toHaveBeenCalled();
  });
  it("should render the right slot", () => {
    const result = render(ListCard(), {
      ...slotOptions({
        left: "Vacation",
        right: "<button>Edit</button>",
      }),
    });
    expect(result.getByText("Edit")).toBeVisible();
  });
});
