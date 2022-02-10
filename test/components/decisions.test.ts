import "@testing-library/jest-dom";
import { fireEvent, render, RenderResult } from "@testing-library/svelte";
import { FakeDecision } from "../helpers/fake";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();
jest.mock("../../src/service/db");

const Decisions = () => require("../../src/components/decisions.svelte");
const Db = () => require("../../src/service/db");

class Harness extends MachineHarness {
  result: RenderResult;
  render() {
    this.result = render(Decisions(), { state: this.state });
  }
  get createInput() {
    return this.result.getByPlaceholderText("Dinner, Vacation, etc.");
  }
  get createButton() {
    return this.result.getByText("Create");
  }
  get deleteButton() {
    return this.result.getByText("Delete");
  }
  get editButton() {
    return this.result.getByText("Edit");
  }
  get loadingText() {
    return this.result.getByText("Loading your decisions");
  }
  get moreButton() {
    return this.result.getByLabelText("more");
  }
  get okButton() {
    return this.result.getByText("Ok");
  }
  get promptInput() {
    return this.result.getByLabelText("Decision Title");
  }
  clickCreateButton() {
    return fireEvent.click(this.createButton);
  }
  clickDeleteButton() {
    return fireEvent.click(this.deleteButton);
  }
  clickEditButton() {
    return fireEvent.click(this.editButton);
  }
  clickMoreButton() {
    return fireEvent.click(this.moreButton);
  }
  clickOkButton() {
    return fireEvent.click(this.okButton);
  }
  setCreateInput(value: string) {
    return fireEvent.input(this.createInput, { target: { value } });
  }
  setPromptInput(value: string) {
    return fireEvent.input(this.promptInput, { target: { value } });
  }
  submitCreateInput() {
    return fireEvent.submit(this.createInput);
  }
}

describe("decisions component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render the create a decision label", () => {
    harness.enter("decisionsLoaded");
    harness.render();
    expect(harness.result.getByText("Create a decision")).toBeVisible();
  });
  it("should render the create decision input", () => {
    harness.enter("decisionsLoaded");
    harness.render();
    expect(harness.createInput).toBeVisible();
  });
  describe("create input is submitted", () => {
    it("should create a decision", async () => {
      harness.enter("decisionsLoaded");
      harness.render();
      await harness.setCreateInput("my decision");
      await harness.submitCreateInput();
      expect(Db().addDecision).toHaveBeenCalledWith(
        harness.state.context.user,
        "my decision"
      );
    });
    it("should transition to the loading state", async () => {
      const decision = new FakeDecision();
      Db().addDecision.mockResolvedValue(decision.id);
      harness.enter("decisionsLoaded");
      harness.render();
      await harness.setCreateInput("my decision");
      await harness.submitCreateInput();
      expect(harness.state.value).toEqual({
        auth: { signedIn: { decision: "loading" } },
      });
    });
  });
  describe("user has no decisions", () => {
    it("should render a placeholder", () => {
      harness.enter("decisionsLoaded");
      harness.render();
      expect(
        harness.result.getByText("Create your first decision to get started")
      ).toBeVisible();
    });
    it("should render a create button", () => {
      harness.enter("decisionsLoaded");
      harness.render();
      expect(harness.createButton).toBeVisible();
    });
    describe("create button is pressed", () => {
      it("should create a decision", async () => {
        harness.enter("decisionsLoaded");
        harness.render();
        await harness.clickCreateButton();
        await harness.setPromptInput("my decision");
        await harness.clickOkButton();
        expect(Db().addDecision).toHaveBeenCalledWith(
          harness.state.context.user,
          "my decision"
        );
      });
      it("should load the newly created decision", async () => {
        const decision = new FakeDecision();
        Db().addDecision.mockResolvedValue(decision.id);
        harness.enter("decisionsLoaded");
        harness.render();
        await harness.clickCreateButton();
        await harness.setPromptInput("my decision");
        await harness.clickOkButton();
        expect(harness.state.value).toEqual({
          auth: { signedIn: { decision: "loading" } },
        });
      });
    });
  });
  describe("each creator decision", () => {
    it("should render a list item", async () => {
      harness.enter("decisionsLoaded");
      harness.sendCreatorDecisionsLoaded([
        new FakeDecision({ id: "decision1", title: "Travel" }),
        new FakeDecision({ id: "decision2", title: "Career" }),
      ]);
      harness.render();
      expect(harness.result.getByText("Travel")).toBeVisible();
      expect(harness.result.getByText("Career")).toBeVisible();
    });
    it("should render a more button", async () => {
      harness.enter("decisionsLoaded");
      harness.sendCreatorDecisionsLoaded([new FakeDecision()]);
      harness.render();
      expect(harness.moreButton).toBeVisible();
    });
    it("should render a delete button", async () => {
      harness.enter("decisionsLoaded");
      harness.sendCreatorDecisionsLoaded([new FakeDecision()]);
      harness.render();
      await harness.clickMoreButton();
      expect(harness.deleteButton).toBeVisible();
    });
    it("should delete the decision when the delete button is clicked", async () => {
      harness.enter("decisionsLoaded");
      harness.sendCreatorDecisionsLoaded([new FakeDecision()]);
      harness.render();
      await harness.clickMoreButton();
      await harness.clickDeleteButton();
      expect(Db().removeDecision).toHaveBeenCalledWith("decisionId");
    });
    it("should render an edit button", async () => {
      harness.enter("decisionsLoaded");
      harness.sendCreatorDecisionsLoaded([new FakeDecision()]);
      harness.render();
      await harness.clickMoreButton();
      expect(harness.editButton).toBeVisible();
    });
    it("should render an edit modal when the edit button is clicked", async () => {
      harness.enter("decisionsLoaded");
      harness.sendCreatorDecisionsLoaded([
        new FakeDecision({ title: "travel" }),
      ]);
      harness.render();
      await harness.clickMoreButton();
      await harness.clickEditButton();
      expect(harness.promptInput).toBeVisible();
      expect(harness.promptInput).toHaveValue("travel");
    });
    it("should update the decision when the ok button is clicked", async () => {
      harness.enter("decisionsLoaded");
      harness.sendCreatorDecisionsLoaded([new FakeDecision()]);
      harness.render();
      await harness.clickMoreButton();
      await harness.clickEditButton();
      await harness.setPromptInput("vacation");
      await harness.clickOkButton();
      expect(Db().updateDecision).toHaveBeenCalledWith(
        new FakeDecision({ title: "vacation" })
      );
    });
    it("should open the decision when clicking on the title", async () => {
      harness.enter("decisionsLoaded");
      harness.sendCreatorDecisionsLoaded([
        new FakeDecision({ title: "travel" }),
      ]);
      harness.render();
      await fireEvent.click(harness.result.getByText("travel"));
      expect(harness.state.value).toEqual({
        auth: { signedIn: { decision: "loading" } },
      });
    });
  });
  describe("each collaborator decision", () => {
    it("should render a list item", async () => {
      harness.enter("decisionsLoaded");
      harness.sendCollaboratorDecisionsLoaded([
        new FakeDecision({ id: "decision1", title: "Travel" }),
        new FakeDecision({ id: "decision2", title: "Career" }),
      ]);
      harness.render();
      expect(harness.result.getByText("Travel")).toBeVisible();
      expect(harness.result.getByText("Career")).toBeVisible();
    });
    it("should open the decision when clicking on the title", async () => {
      harness.enter("decisionsLoaded");
      harness.sendCollaboratorDecisionsLoaded([
        new FakeDecision({ title: "travel" }),
      ]);
      harness.render();
      await fireEvent.click(harness.result.getByText("travel"));
      expect(harness.state.value).toEqual({
        auth: { signedIn: { decision: "loading" } },
      });
    });
  });
});
