import "@testing-library/jest-dom";
import { fireEvent, render, RenderResult } from "@testing-library/svelte";

jest.disableAutomock();
jest.mock("../../src/service/auth");

const SignIn = () => require("../../src/components/sign-in");
const Auth = () => require("../../src/service/auth");

class Harness {
  result: RenderResult;
  get continueAsGuestButton() {
    return this.result.getByText("continue as a guest");
  }
  get signInWithGoogleButton() {
    return this.result.getByText("Sign in with Google");
  }
  clickContinueAsGuestButton() {
    return fireEvent.click(this.continueAsGuestButton);
  }
  clickSignInWithGoogle() {
    return fireEvent.click(this.signInWithGoogleButton);
  }
  render() {
    this.result = render(SignIn());
  }
}

describe("sign in component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it("should render 'Sign In'", () => {
    harness.render();
    expect(harness.result.getByText("Sign In")).toBeVisible();
  });
  it("should render the Sign in with Google button", () => {
    harness.render();
    expect(harness.signInWithGoogleButton).toBeVisible();
  });
  it("should sign in with google when button is clicked", async () => {
    harness.render();
    await harness.clickSignInWithGoogle();
    expect(Auth().signInWithGoogle).toHaveBeenCalled();
  });
  it("should render the continue as a guest button", () => {
    harness.render();
    expect(harness.continueAsGuestButton).toBeVisible();
  });
  it("should sign in anonymously when button is clicked", async () => {
    harness.render();
    await harness.clickContinueAsGuestButton();
    expect(Auth().signInAnonymously).toHaveBeenCalled();
  });
});
