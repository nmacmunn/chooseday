import "@testing-library/jest-dom";
import { render, fireEvent, RenderResult } from "@testing-library/svelte";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();

const Nav = () => require("../../src/components/nav");

class Harness extends MachineHarness {
  result: RenderResult;
  render() {
    this.result = render(Nav());
  }
  get collaborators() {
    return this.result.getByText("Collaborators");
  }
  get criteria() {
    return this.result.getByText("Criteria");
  }
  get decisions() {
    return this.result.getByText("Decisions");
  }
  get options() {
    return this.result.getByText("Options");
  }
  get ratings() {
    return this.result.getByText("Ratings");
  }
  get results() {
    return this.result.getByText("Results");
  }
  clickCollaborators() {
    return fireEvent.click(this.collaborators);
  }
  clickCriteria() {
    return fireEvent.click(this.criteria);
  }
  clickDecisions() {
    return fireEvent.click(this.decisions);
  }
  clickOptions() {
    return fireEvent.click(this.options);
  }
  clickRatings() {
    return fireEvent.click(this.ratings);
  }
  clickResults() {
    return fireEvent.click(this.results);
  }
}

describe("nav component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  describe("decisions", () => {
    it("should be disabled when signing in", () => {
      harness.enter("signingIn");
      harness.render();
      expect(harness.decisions.parentElement).toHaveClass("uk-disabled");
    });
    it("should be active when decisions are loaded", () => {
      harness.enter("decisionsLoaded");
      harness.render();
      expect(harness.decisions.parentElement).toHaveClass("uk-active");
    });
    it("should transition to decisions on click", async () => {
      harness.enter("route");
      harness.render();
      await harness.clickDecisions();
      expect(harness.state.value).toEqual({
        auth: { signedIn: { decisions: "loading" } },
      });
    });
  });
  describe("options", () => {
    it("should be disabled when decision is loading", () => {
      harness.enter("decisionLoading");
      harness.render();
      expect(harness.options.parentElement).toHaveClass("uk-disabled");
    });
    it("should be active when in options", () => {
      harness.enter("options");
      harness.render();
      expect(harness.options.parentElement).toHaveClass("uk-active");
    });
    it("should transition to options on click", async () => {
      harness.enter("options");
      harness.render();
      await harness.clickOptions();
      expect(harness.state.value).toEqual({
        auth: { signedIn: { decision: { loaded: "options" } } },
      });
    });
  });
  describe("criteria", () => {
    it("should be disabled when in options", () => {
      harness.enter("options");
      harness.render();
      expect(harness.criteria.parentElement).toHaveClass("uk-disabled");
    });
    it("should be active when in criteria", () => {
      harness.enter("criteria");
      harness.render();
      expect(harness.criteria.parentElement).toHaveClass("uk-active");
    });
    it("should transition to criteria on click", async () => {
      harness.enter("ratings");
      harness.render();
      await harness.clickCriteria();
      expect(harness.state.value).toEqual({
        auth: { signedIn: { decision: { loaded: "criteria" } } },
      });
    });
  });
  describe("ratings", () => {
    it("should be disabled when in criteria", () => {
      harness.enter("criteria");
      harness.render();
      expect(harness.ratings.parentElement).toHaveClass("uk-disabled");
    });
    it("should be active when in ratings", () => {
      harness.enter("ratings");
      harness.render();
      expect(harness.ratings.parentElement).toHaveClass("uk-active");
    });
    it("should transition to ratings on click", async () => {
      harness.enter("collaborators");
      harness.render();
      await harness.clickRatings();
      expect(harness.state.value).toEqual({
        auth: { signedIn: { decision: { loaded: "ratings" } } },
      });
    });
  });
  describe("collaborators", () => {
    it("should be disabled when in ratings", () => {
      harness.enter("ratings");
      harness.render();
      expect(harness.collaborators.parentElement).toHaveClass("uk-disabled");
    });
    it("should be active when in collaborators", () => {
      harness.enter("collaborators");
      harness.render();
      expect(harness.collaborators.parentElement).toHaveClass("uk-active");
    });
    it("should transition to collaborators on click", async () => {
      harness.enter("collaborators");
      harness.render();
      await harness.clickCollaborators();
      expect(harness.state.value).toEqual({
        auth: { signedIn: { decision: { loaded: "collaborators" } } },
      });
    });
  });
  describe("results", () => {
    it("should be disabled when in ratings", () => {
      harness.enter("ratings");
      harness.render();
      expect(harness.results.parentElement).toHaveClass("uk-disabled");
    });
    it("should be active when in results", () => {
      harness.enter("results");
      harness.render();
      expect(harness.results.parentElement).toHaveClass("uk-active");
    });
    it("should transition to results on click", async () => {
      harness.enter("collaborators");
      harness.render();
      await harness.clickResults();
      expect(harness.state.value).toEqual({
        auth: { signedIn: { decision: { loaded: "results" } } },
      });
    });
  });
});
