import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import { slotOptions } from "../helpers/slots";

jest.disableAutomock();

const PlaceholderCard = () => require("../../src/components/placeholder-card");

describe("placeholder component", () => {
  beforeEach(() => jest.resetModules());
  it("should render the placeholder content", () => {
    const result = render(
      PlaceholderCard(),
      slotOptions({ default: "My Placeholder Content" })
    );
    expect(result.getByText("My Placeholder Content")).toBeVisible();
  });
});
