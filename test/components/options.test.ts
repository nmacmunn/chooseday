import "@testing-library/jest-dom";
import { render, fireEvent, RenderResult } from "@testing-library/svelte";
import { FakeOption, FakeUser } from "../helpers/fake";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();
jest.mock("../../src/service/db");

const Db = () => require("../../src/service/db");
const Options = () => require("../../src/components/options");

class Harness extends MachineHarness {
  result: RenderResult;
  render() {
    this.result = render(Options(), { state: this.state });
  }
  get createInput() {
    return this.result.getByPlaceholderText("Pizza, sushi, etc.");
  }
  get deleteButton() {
    return this.result.getByTitle("delete");
  }
  get editButton() {
    return this.result.getByTitle("edit");
  }
  get moreButton() {
    return this.result.getByLabelText("more").parentElement;
  }
  get titleInput() {
    return this.result.getByLabelText("Option Title");
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
  setCreateInput(value: string) {
    return fireEvent.input(this.createInput, { target: { value } });
  }
  setTitleInput(value: string) {
    return fireEvent.input(this.titleInput, { target: { value } });
  }
  submitCreateInput() {
    return fireEvent.submit(this.createInput);
  }
  submitTitleInput() {
    return fireEvent.submit(this.titleInput);
  }
}

describe("options component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render the create input", () => {
    harness.enter("options");
    harness.render();
    expect(harness.createInput).toBeVisible();
  });
  it("should render 'Options you're considering'", async () => {
    harness.enter("options");
    harness.render();
    expect(
      harness.result.getByText("Options you're considering")
    ).toBeVisible();
  });
  it("should add an option when create input is submitted", async () => {
    harness.enter("options");
    harness.render();
    await harness.setCreateInput("New Option");
    await harness.submitCreateInput();
    expect(Db().addOption).toHaveBeenCalledWith("decisionId", "New Option");
  });
  it("should render a placeholder if there are no options", () => {
    harness.enter("options");
    harness.render();
    expect(
      harness.result.getByText("Create at least two options")
    ).toBeVisible();
  });
  it("should render a placeholder if there is one option", () => {
    harness.enter("options");
    harness.sendOptionsLoaded([new FakeOption()]);
    harness.render();
    expect(
      harness.result.getByText("Create at least one more option")
    ).toBeVisible();
  });
  it("should render each option title", () => {
    harness.enter("options");
    harness.sendOptionsLoaded([
      new FakeOption({ id: "1", title: "First Option" }),
      new FakeOption({ id: "2", title: "Second Option" }),
    ]);
    harness.render();
    expect(harness.result.getByText("First Option")).toBeVisible();
    expect(harness.result.getByText("Second Option")).toBeVisible();
  });
  it("should render a more button for each option", () => {
    harness.enter("options");
    harness.sendOptionsLoaded([new FakeOption()]);
    harness.render();
    expect(harness.moreButton).toBeVisible();
  });
  it("should render a delete button when more is clicked", async () => {
    harness.enter("options");
    harness.sendOptionsLoaded([new FakeOption()]);
    harness.render();
    await harness.clickMoreButton();
    expect(harness.deleteButton).toBeVisible();
  });
  it("should delete the option when delete is clicked", async () => {
    harness.enter("options");
    harness.sendOptionsLoaded([new FakeOption()]);
    harness.render();
    await harness.clickMoreButton();
    await harness.clickDeleteButton();
    expect(Db().removeOption).toHaveBeenCalledWith(
      harness.state.context.options[0]
    );
  });
  it("should render an edit button when more is clicked", async () => {
    harness.enter("options");
    harness.sendOptionsLoaded([new FakeOption()]);
    harness.render();
    await harness.clickMoreButton();
    expect(harness.editButton).toBeVisible();
  });
  it("should render a title input when edit is clicked", async () => {
    harness.enter("options");
    harness.sendOptionsLoaded([new FakeOption()]);
    harness.render();
    await harness.clickMoreButton();
    await harness.clickEditButton();
    expect(harness.titleInput).toBeVisible();
  });
  it("should update the option when the title input is submitted", async () => {
    harness.enter("options");
    harness.sendOptionsLoaded([new FakeOption()]);
    harness.render();
    await harness.clickMoreButton();
    await harness.clickEditButton();
    await harness.setTitleInput("New Title");
    await harness.submitTitleInput();
    expect(Db().updateOption).toHaveBeenCalledWith(
      new FakeOption({ title: "New Title" })
    );
  });
  describe("user is not the decision creator", () => {
    beforeEach(() => {
      harness.enter("signingIn");
      harness.sendSignIn(new FakeUser({ id: "someone" }));
      harness.sendDecision();
      harness.sendCriteriaLoaded();
      harness.sendOptionsLoaded();
      harness.sendRatingsLoaded();
      harness.render();
    });
    it("should not render the create input if user is not creator", () => {
      expect(() => harness.createInput).toThrow();
    });
    it("should not render the more button", () => {
      expect(() => harness.moreButton).toThrow();
    });
  });
});
