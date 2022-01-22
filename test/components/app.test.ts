import { render } from "@testing-library/svelte";
import App from "../../src/components/app.svelte";
import "@testing-library/jest-dom";

jest.disableAutomock();
jest.unmock("svelte/internal");
jest.unmock("xstate");

describe("App", () => {
  it("should render the navbar", () => {
    const result = render(App);
    expect(result.getByText("Indecisionator II")).toBeVisible();
  });
  it("should render the nav", () => {
    const result = render(App);
    expect(result.getByText("Decisions")).toBeVisible();
  });
  it("should render the body", () => {
    const result = render(App);
    expect(result.getByText("Loading, please wait...")).toBeVisible();
  });
});
