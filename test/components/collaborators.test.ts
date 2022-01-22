import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import { FakeDecision, FakeUser } from "../helpers/fake";

jest.disableAutomock();
jest.mock("../../src/service/db");

const Collaborators = () =>
  require("../../src/components/collaborators.svelte");

describe("collaborators", () => {
  beforeEach(() => jest.resetModules());
  it("should show the add collaborator input to the creator", () => {
    const state = {
      context: {
        decision: new FakeDecision(),
        user: new FakeUser(),
      },
    };
    const result = render(Collaborators(), { state });
    expect(result.getByText("Add a collaborator (optional)")).toBeVisible();
  });
  it("should not show the add collaborator input to collaborators", () => {
    const state = {
      context: {
        decision: new FakeDecision(),
        user: new FakeUser({ id: "collaborator" }),
      },
    };
    const result = render(Collaborators(), { state });
    expect(result.queryByText("Add a collaborator (optional)")).toBeNull();
  });
  it("should show a placeholder card to the creator if there are no collaborators", async () => {
    const state = {
      context: {
        decision: new FakeDecision(),
        user: new FakeUser(),
      },
    };
    const result = render(Collaborators(), { state });
    expect(
      result.getByText("Enter an email address to add a collaborator")
    ).toBeVisible();
  });
  it("should not show the placeholder if there are collaborators", async () => {
    const state = {
      context: {
        decision: new FakeDecision({
          collaborators: ["friend@example.com"],
        }),
        user: new FakeUser(),
      },
    };
    const result = render(Collaborators(), { state });
    expect(
      result.queryByText("Enter an email address to add a collaborator")
    ).toBeNull();
  });
  it("should not show the placeholder to collaborators", () => {
    const state = {
      context: {
        decision: new FakeDecision(),
        user: new FakeUser({ id: "collaborator" }),
      },
    };
    const result = render(Collaborators(), { state });
    expect(
      result.queryByText("Enter an email address to add a collaborator")
    ).toBeNull();
  });
  it("should show each collaborator", () => {
    const state = {
      context: {
        decision: new FakeDecision({
          collaborators: ["obi@example.com", "mace@example.com"],
        }),
        user: new FakeUser(),
      },
    };
    const result = render(Collaborators(), { state });
    expect(result.getByText("obi@example.com")).toBeVisible();
    expect(result.getByText("mace@example.com")).toBeVisible();
  });
  it("should show a back to ratings button", () => {
    const state = {
      context: {
        decision: new FakeDecision(),
        user: new FakeUser(),
      },
    };
    const result = render(Collaborators(), { state });
    expect(result.getByText("Ratings")).toBeVisible();
  });
  it("should show a forward to results button", () => {
    const state = {
      context: {
        decision: new FakeDecision(),
        user: new FakeUser(),
      },
    };
    const result = render(Collaborators(), { state });
    expect(result.getByText("Results")).toBeVisible();
  });
});
