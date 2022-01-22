import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

jest.disableAutomock();

const Loading = () => require("../../src/components/loading");

describe("loading component", () => {
  beforeEach(() => jest.resetModules());
  it("should render the specified text", () => {
    const result = render(Loading(), {
      text: "Loading, please wait...",
    });
    expect(result.getByText("Loading, please wait...")).toBeVisible();
  });
});
