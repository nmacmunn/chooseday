import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";
import { slotOptions } from "../helpers/slots";

jest.disableAutomock();

const Alert = () => require("../../src/components/alert");

describe("alert component", () => {
  beforeEach(() => jest.resetModules());
  it("should render the alert content", () => {
    const result = render(
      Alert(),
      slotOptions({ default: "My Alert Content" })
    );
    expect(result.getByText("My Alert Content")).toBeVisible();
  });
});
