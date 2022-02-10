import "@testing-library/jest-dom";
import { render, fireEvent, RenderResult } from "@testing-library/svelte";
import { FakeUser } from "../helpers/fake";
import { MachineHarness } from "../helpers/machine";

jest.disableAutomock();
jest.mock("../../src/service/auth");

const Auth = () => require("../../src/service/auth");
const Navbar = () => require("../../src/components/navbar");

class Harness extends MachineHarness {
  result: RenderResult;
  render() {
    this.result = render(Navbar());
  }
  get githubLink() {
    return this.result.getByLabelText("Github").parentElement;
  }
  get linkToGoogleLink() {
    return this.result.getByText("Link to Google").parentElement;
  }
  get logo() {
    return this.result.getByText("Chooseday");
  }
  get signOutLink() {
    return this.result.getByText("Sign Out");
  }
  get userLink() {
    return this.result.getByLabelText("User").parentElement;
  }
  clickGithubLink() {
    return fireEvent.click(this.githubLink);
  }
  clickLinkToGoogle() {
    return fireEvent.click(this.linkToGoogleLink);
  }
  clickUserLink() {
    return fireEvent.click(this.userLink);
  }
  clickSignOutLink() {
    return fireEvent.click(this.signOutLink);
  }
}

describe("navbar component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render the logo", () => {
    harness.render();
    expect(harness.logo).toBeVisible();
  });
  describe("user is signed out", () => {
    it("should not render the github link", () => {
      harness.enter("signedOut");
      harness.render();
      expect(() => harness.githubLink).toThrow();
    });
    it("should not render the user link", () => {
      harness.enter("signedOut");
      harness.render();
      expect(() => harness.userLink).toThrow();
    });
  });
  describe("user is signed in", () => {
    it("should render the github logo", () => {
      harness.enter("decisionsLoading");
      harness.render();
      expect(harness.githubLink).toBeVisible();
    });
    it("should render the user link", () => {
      harness.enter("decisionsLoading");
      harness.render();
      expect(harness.userLink).toBeVisible();
    });
    describe("clicking on the user link", () => {
      it("should render email if user has one", async () => {
        harness.enter("decisionsLoading");

        harness.render();
        await harness.clickUserLink();
        expect(harness.result.getByText("user@example.com")).toBeVisible();
      });
      it("should render 'Guest' if user does not have email", async () => {
        harness.sendRedirectResult();
        harness.sendSignIn(new FakeUser({ email: undefined }));
        harness.render();
        await harness.clickUserLink();
        expect(harness.result.getByText("Guest")).toBeVisible();
      });
      it("should render the google link if user does not have email", async () => {
        harness.sendRedirectResult();
        harness.sendSignIn(new FakeUser({ email: undefined }));
        harness.render();
        await harness.clickUserLink();
        expect(harness.linkToGoogleLink).toBeVisible();
      });
      it("should link to google when link is clicked", async () => {
        harness.sendRedirectResult();
        harness.sendSignIn(new FakeUser({ email: undefined }));
        harness.render();
        await harness.clickUserLink();
        await harness.clickLinkToGoogle();
        expect(Auth().linkWithGoogle).toHaveBeenCalled();
      });
      it("should render the sign out link", async () => {
        harness.enter("decisionsLoading");
        harness.render();
        await harness.clickUserLink();
        expect(harness.signOutLink).toBeVisible();
      });
      it("should sign out when link is clicked", async () => {
        harness.enter("decisionsLoading");
        harness.render();
        await harness.clickUserLink();
        await harness.clickSignOutLink();
        expect(Auth().signOut).toHaveBeenCalled();
      });
    });
  });
});
