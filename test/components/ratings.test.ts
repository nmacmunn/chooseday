import "@testing-library/jest-dom";
import { render, fireEvent, RenderResult, act } from "@testing-library/svelte";
import { MachineHarness } from "../helpers/machine";
import { textContentMatcher } from "../helpers/matchers";

jest.disableAutomock();

const Ratings = () => require("../../src/components/ratings");

class Harness extends MachineHarness {
  result: RenderResult;
  render() {
    this.result = render(Ratings(), { state: this.state });
  }
  get collaboratorsButton() {
    return this.result.getByText("Collaborators");
  }
  get criteriaButton() {
    return this.result.getByText("Criteria");
  }
  get firstCriterionButton() {
    return this.result
      .getAllByText("First Criterion")
      .find((el) => el.tagName === "BUTTON");
  }
  get firstCriterionTab() {
    return this.result
      .getAllByText("First Criterion")
      .find((el) => el.tagName === "A");
  }
  get firstOption() {
    return this.result.getByText("First Option");
  }
  get secondCriterionButton() {
    return this.result
      .getAllByText("Second Criterion")
      .find((el) => el.tagName === "BUTTON");
  }
  get secondCriterionTab() {
    return this.result
      .getAllByText("Second Criterion")
      .find((el) => el.tagName === "A");
  }
  get secondOption() {
    return this.result.getByText("Second Option");
  }
  clickFirstCriterionTab() {
    return fireEvent.click(this.firstCriterionTab);
  }
  clickSecondCriterionTab() {
    return fireEvent.click(this.secondCriterionTab);
  }
  clickFirstCriterionButton() {
    return fireEvent.click(this.firstCriterionButton);
  }
  clickSecondCriterionButton() {
    return fireEvent.click(this.secondCriterionButton);
  }
  async refresh() {
    this.result.component.$set({ state: this.state });
    await act();
  }
}

describe("ratings component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render a tab for each criterion", () => {
    harness.enter("collaborators");
    harness.sendRatings();
    harness.render();
    expect(harness.firstCriterionTab).toBeVisible();
    expect(harness.secondCriterionTab).toBeVisible();
  });
  it("should change criterion when a tab is clicked", async () => {
    harness.enter("collaborators");
    harness.sendRatings();
    harness.render();
    await harness.clickSecondCriterionTab();
    expect(harness.state.context.criterion).toEqual(
      harness.state.context.criteria[1]
    );
    await harness.clickFirstCriterionTab();
    expect(harness.state.context.criterion).toEqual(
      harness.state.context.criteria[0]
    );
  });
  it("should change criterion when button is clicked", async () => {
    harness.enter("collaborators");
    harness.sendRatings();
    harness.render();
    await harness.clickSecondCriterionButton();
    expect(harness.state.context.criterion).toEqual(
      harness.state.context.criteria[1]
    );
    await harness.refresh();
    await harness.clickFirstCriterionButton();
    expect(harness.state.context.criterion).toEqual(
      harness.state.context.criteria[0]
    );
  });
  it("should prevent changing criteria if ratings have equal weight", async () => {
    harness.enter("ratings");
    harness.render();
    expect(harness.secondCriterionTab.parentElement).toHaveClass("disabled");
    await harness.clickSecondCriterionButton();
    expect(harness.state.context.criterion).toEqual(
      harness.state.context.criteria[0]
    );
  });
  it("should render 'Sort options by CRITERION from best to worst'", () => {
    harness.enter("collaborators");
    harness.sendRatings();
    harness.render();
    expect(
      harness.result.getByText(
        textContentMatcher("Sort options by First Criterion from best to worst")
      )
    ).toBeVisible();
  });
  it("should render 'Best option'", () => {
    harness.enter("collaborators");
    harness.sendRatings();
    harness.render();
    expect(
      harness.result.getByText(textContentMatcher("Best option"))
    ).toBeVisible();
  });
  it("should render each option", () => {
    harness.enter("collaborators");
    harness.sendRatings();
    harness.render();
    expect(harness.firstOption).toBeVisible();
    expect(harness.secondOption).toBeVisible();
  });
  it("should render 'Worst option'", () => {
    harness.enter("collaborators");
    harness.sendRatings();
    harness.render();
    expect(
      harness.result.getByText(textContentMatcher("Worst option"))
    ).toBeVisible();
  });
  it("should render Criteria button when rating first criteria", () => {
    harness.enter("collaborators");
    harness.sendRatings();
    harness.render();
    expect(harness.criteriaButton).toBeVisible();
  });
  it("should render Collaborators button when rating last criteria", () => {
    harness.enter("collaborators");
    harness.sendRatings();
    harness.sendCriterion(harness.state.context.criteria[1]);
    harness.render();
    expect(harness.collaboratorsButton).toBeVisible();
  });
});
