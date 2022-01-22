import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import { slotOptions } from "../helpers/slots";

jest.disableAutomock();

const Heading = () => require("../../src/components/heading");

describe("heading component", () => {
  beforeEach(() => jest.resetModules());
  it("should render whatever is passed to it", () => {
    const result = render(
      Heading(),
      slotOptions({
        default: "My Decision Options",
      })
    );
    expect(result.getByText("My Decision Options")).toBeVisible();
  });
});
