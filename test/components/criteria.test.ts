import "@testing-library/jest-dom";
import { fireEvent, render, RenderResult } from "@testing-library/svelte";
import {
  FakeCriterion,
  FakeDecision,
  FakeOption,
  FakeUser,
} from "../helpers/fake";
import { MachineHarness } from "../helpers/machine";
import { textContentMatcher } from "../helpers/matchers";

jest.disableAutomock();
jest.mock("../../src/service/db");

const Criteria = () => require("../../src/components/criteria.svelte");
const Db = () => require("../../src/service/db");

class Harness extends MachineHarness {
  result: RenderResult;
  get addInput() {
    return this.result.getByPlaceholderText(
      "Cost, nutrition, delivery time, etc."
    );
  }
  get deleteButton() {
    return this.result.getByText("Delete");
  }
  get editButton() {
    return this.result.getByText("Edit");
  }
  get moreButton() {
    return this.result.getByLabelText("more");
  }
  get okButton() {
    return this.result.getByText("Ok");
  }
  get titleInput() {
    return this.result.getByLabelText("Criterion Title");
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
  render() {
    this.result = render(Criteria(), { state: this.state });
  }
  setAddInput(value: string) {
    return fireEvent.input(this.addInput, { target: { value } });
  }
  setTitleInput(value: string) {
    return fireEvent.input(this.titleInput, { target: { value } });
  }
  submitAddInput() {
    return fireEvent.submit(this.addInput);
  }
}

describe("criteria component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render the add criteria label", () => {
    harness.enter("criteria");
    harness.render();
    expect(harness.result.getByText("Add criteria")).toBeVisible();
  });
  it("should render the add criteria input", () => {
    harness.enter("criteria");
    harness.render();
    expect(harness.addInput).toBeVisible();
  });
  it("should render the sort message", () => {
    harness.enter("criteria");
    harness.render();
    expect(
      harness.result.getByText("Sort from most to least important")
    ).toBeVisible();
  });
  it("should render an alert if there are no criteria", () => {
    harness.enter("criteria");
    harness.render();
    expect(
      harness.result.getByText("Create at least two criteria")
    ).toBeVisible();
  });
  it("should render an alert if there is one criteria", () => {
    harness.enter("criteria");
    harness.sendCriteriaLoaded([new FakeCriterion()]);
    harness.render();
    expect(
      harness.result.getByText("Create at least one more criterion")
    ).toBeVisible();
  });
  it("should render a most important label", () => {
    harness.enter("criteria");
    harness.render();
    expect(harness.result.getByText("Most important")).toBeVisible();
  });
  it("should render a placeholder if there are no critera", () => {
    harness.enter("criteria");
    harness.render();
    expect(harness.result.getByText("No criteria yet")).toBeVisible();
  });
  it("should render each criterion", () => {
    harness.enter("criteria");
    harness.sendCriteriaLoaded([
      new FakeCriterion({ title: "first criterion" }),
      new FakeCriterion({ title: "second criterion" }),
    ]);
    harness.render();
    expect(harness.result.getByText("first criterion")).toBeVisible();
    expect(harness.result.getByText("second criterion")).toBeVisible();
  });
  it("should render a least important label", () => {
    harness.enter("criteria");
    harness.render();
    expect(harness.result.getByText("Least important")).toBeVisible();
  });
  it("should render an options button", () => {
    harness.enter("criteria");
    harness.render();
    expect(harness.result.getByText("Options")).toBeVisible();
  });
  it("should render a ratings button", () => {
    harness.enter("criteria");
    harness.render();
    expect(harness.result.getByText("Ratings")).toBeVisible();
  });
  it("should add a new criterion", async () => {
    harness.enter("criteria");
    harness.render();
    await harness.setAddInput("new criterion");
    await harness.submitAddInput();
    expect(Db().addCriterion).toHaveBeenCalledWith(
      harness.state.context.decision.id,
      "new criterion",
      harness.state.context.user
    );
  });
  it("should update a criterion title", async () => {
    harness.enter("criteria");
    harness.sendCriteriaLoaded([new FakeCriterion()]);
    harness.render();
    await harness.clickMoreButton();
    await harness.clickEditButton();
    await harness.setTitleInput("new title");
    await harness.clickOkButton();
    expect(harness.state.context.criteria[0].title).toBe("new title");
    expect(Db().updateCriterion).toHaveBeenCalledWith(
      harness.state.context.criteria[0]
    );
  });
  it("should delete the criterion", async () => {
    harness.enter("criteria");
    harness.sendCriteriaLoaded([new FakeCriterion()]);
    harness.render();
    await harness.clickMoreButton();
    await harness.clickDeleteButton();
    expect(Db().removeCriterion).toHaveBeenCalledWith(
      harness.state.context.criteria[0]
    );
  });
});
