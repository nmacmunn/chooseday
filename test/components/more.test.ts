import "@testing-library/jest-dom";
import { render, fireEvent, RenderResult } from "@testing-library/svelte";

jest.disableAutomock();

const More = () => require("../../src/components/more");

class Harness {
  result: RenderResult;
  render(options: any) {
    this.result = render(More(), options);
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
  clickDelete() {
    return fireEvent.click(this.deleteButton);
  }
  clickEdit() {
    return fireEvent.click(this.editButton);
  }
  clickMore() {
    return fireEvent.click(this.moreButton);
  }
}

describe("more component", () => {
  let harness: Harness;
  beforeEach(() => {
    jest.resetModules();
    harness = new Harness();
  });
  it.skip("should hide the dropdown initially", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    harness.render({ onDelete, onEdit });
    expect(harness.deleteButton).not.toBeVisible();
    expect(harness.editButton).not.toBeVisible();
  });
  it("should show a dropdown on click", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    harness.render({ onDelete, onEdit });
    await harness.clickMore();
    expect(harness.deleteButton).toBeVisible();
    expect(harness.editButton).toBeVisible();
  });
  it("should call onEdit when edit is clicked", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    harness.render({ onDelete, onEdit });
    await harness.clickMore();
    await harness.clickEdit();
    expect(onEdit).toHaveBeenCalled();
  });
  it.skip("should hide the dropdown when edit is clicked", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    harness.render({ onDelete, onEdit });
    await harness.clickMore();
    await harness.clickEdit();
    expect(harness.deleteButton).not.toBeVisible();
    expect(harness.editButton).not.toBeVisible();
  });
  it("should call onDelete when delete is clicked", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    harness.render({ onDelete, onEdit });
    await harness.clickMore();
    await harness.clickDelete();
    expect(onDelete).toHaveBeenCalled();
  });
  it.skip("should hide the dropdown when delete is clicked", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    harness.render({ onDelete, onEdit });
    await harness.clickMore();
    await harness.clickDelete();
    expect(harness.deleteButton).not.toBeVisible();
    expect(harness.editButton).not.toBeVisible();
  });
});
