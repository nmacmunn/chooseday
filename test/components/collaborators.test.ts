import "@testing-library/jest-dom";
import { render, RenderResult, fireEvent } from "@testing-library/svelte";
import { FakeDecision, FakeUser } from "../helpers/fake";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();
jest.mock("../../src/service/db");

const Collaborators = () =>
  require("../../src/components/collaborators.svelte");
const Db = () => require("../../src/service/db");

class Harness extends MachineHarness {
  result: RenderResult;
  render() {
    this.result = render(Collaborators(), { state: this.state });
  }
  get copiedButton() {
    return this.result.getByText("Copied!");
  }
  get copyButton() {
    return this.result.getByText("Copy");
  }
  get creatorCard() {
    return this.result.getByText("user@example.com");
  }
  get enableButton() {
    return this.result.getByText("Enable");
  }
  get moreButton() {
    return this.result.getByLabelText("more");
  }
  get linkAccountButton() {
    return this.result.getByText("Link account");
  }
  get placeholderText() {
    return this.result.getByText("Nobody collaborating yet");
  }
  get removeButton() {
    return this.result.getByText("Remove");
  }
  get urlInput() {
    return this.result.getByDisplayValue("/foo");
  }
  clickCopyButton() {
    return fireEvent.click(this.copyButton);
  }
  clickEnableButton() {
    return fireEvent.click(this.enableButton);
  }
  clickMoreButton() {
    return fireEvent.click(this.moreButton);
  }
  clickRemoveButton() {
    return fireEvent.click(this.removeButton);
  }
}

describe("collaborators", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should show the link account button if creator doesn't have an email", () => {
    harness.enter("collaborators");
    harness.sendSignIn({ id: "userId" });
    harness.render();
    expect(harness.linkAccountButton).toBeVisible();
  });
  it("should show the enable collaboration button if not enabled", () => {
    const decision = new FakeDecision({ collaborators: undefined });
    harness.enter("collaborators");
    harness.sendDecisionLoaded(decision);
    harness.render();
    expect(harness.enableButton).toBeVisible();
  });
  it("should enable collaboration when the button is pressed", async () => {
    const decision = new FakeDecision({ collaborators: undefined });
    harness.enter("collaborators");
    harness.sendDecisionLoaded(decision);
    harness.render();
    await harness.clickEnableButton();
    expect(Db().enableCollaborators).toHaveBeenCalledWith(decision);
  });
  it("should show the creator an input with the decision url", () => {
    jest
      .spyOn(window, "location", "get")
      .mockReturnValue({ href: "/foo" } as Location);
    harness.enter("collaborators");
    harness.render();
    expect(harness.urlInput).toBeVisible();
  });
  it("should not show collaborators an input with the decision url", () => {
    jest
      .spyOn(window, "location", "get")
      .mockReturnValue({ href: "/foo" } as Location);
    harness.enter("collaborators");
    harness.sendSignIn({ email: "friend@example.com", id: "friendId" });
    harness.render();
    expect(() => harness.urlInput).toThrow();
  });
  it("should show the create a copy url button", () => {
    harness.enter("collaborators");
    harness.render();
    expect(harness.copyButton).toBeVisible();
  });
  it("should change the copy button text when it's clicked", async () => {
    const writeText = jest.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    harness.enter("collaborators");
    harness.render();
    await harness.clickCopyButton();
    expect(harness.copiedButton).toBeVisible();
  });
  it("should copy the url when copy is clicked", async () => {
    jest
      .spyOn(window, "location", "get")
      .mockReturnValue({ href: "/foo" } as Location);
    const writeText = jest.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    harness.enter("collaborators");
    harness.render();
    await harness.clickCopyButton();
    expect(writeText).toHaveBeenCalledWith("/foo");
  });
  it("should show a placeholder card to the creator if there are no collaborators", () => {
    harness.enter("collaborators");
    harness.render();
    expect(harness.placeholderText).toBeVisible();
  });
  it("should not show the placeholder if there are collaborators", () => {
    harness.enter("collaborators");
    const decision = new FakeDecision();
    decision.collaborators = [
      {
        active: true,
        email: "friend@example.com",
        id: "friendId",
      },
    ];
    harness.sendDecisionLoaded(decision);
    harness.render();
    expect(() => harness.placeholderText).toThrow();
  });
  it("should not show the creator to themself", () => {
    harness.enter("collaborators");
    harness.render();
    expect(() => harness.creatorCard).toThrow();
  });
  it("should show the creator to collaborators", () => {
    harness.enter("collaborators");
    harness.sendSignIn({ email: "friend@example.com", id: "friendId" });
    harness.render();
    expect(harness.creatorCard).toBeVisible();
  });
  it("should show each active collaborator", () => {
    const decision = new FakeDecision({
      collaborators: [
        {
          active: true,
          email: "obi@example.com",
          id: "obiId",
        },
        {
          active: false,
          email: "mace@example.com",
          id: "maceId",
        },
      ],
    });
    harness.enter("collaborators");
    harness.sendDecisionLoaded(decision);
    harness.render();
    expect(harness.result.getByText("obi@example.com")).toBeVisible();
    expect(() => harness.result.getByText("mace@example.com")).toThrow();
  });
  it("should show the creator a remove collaborator button", async () => {
    const decision = new FakeDecision({
      collaborators: [
        {
          active: true,
          email: "obi@example.com",
          id: "obiId",
        },
      ],
    });
    harness.enter("collaborators");
    harness.sendDecisionLoaded(decision);
    harness.render();
    await harness.clickMoreButton();
    expect(harness.removeButton).toBeVisible();
  });
  it("should not show collaborators the more button", () => {
    harness.enter("collaborators");
    harness.sendSignIn({ email: "friend@example.com", id: "friendId" });
    harness.render();
    expect(() => harness.moreButton).toThrow();
  });
  it("should remove a collaborator when the button is pressed", async () => {
    const decision = new FakeDecision({
      collaborators: [
        {
          active: true,
          email: "obi@example.com",
          id: "obiId",
        },
      ],
    });
    harness.enter("collaborators");
    harness.sendDecisionLoaded(decision);
    harness.render();
    await harness.clickMoreButton();
    await harness.clickRemoveButton();
    expect(Db().removeCollaborator).toHaveBeenCalledWith(decision, {
      active: true,
      email: "obi@example.com",
      id: "obiId",
    });
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
