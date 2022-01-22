import { detach, insert, noop } from "svelte/internal";

function createElement(innerHTML: string) {
  const template = document.createElement("template");
  template.innerHTML = innerHTML;
  return [...template.content.childNodes];
}

function createSlotFn(innerHTML: string) {
  const elements = createElement(innerHTML);
  return function () {
    return {
      c: noop,
      m: function mount(target: any, anchor: any) {
        for (const element of elements) {
          insert(target, element, anchor);
        }
      },
      d: function destroy(detaching: any) {
        if (detaching) {
          for (const element of elements) {
            detach(element);
          }
        }
      },

      l: noop,
    };
  };
}

export function slotOptions(slots: Record<string, string>) {
  const $$slots = {};
  for (const slotName in slots) {
    $$slots[slotName] = [createSlotFn(slots[slotName])];
  }
  return {
    $$scope: {},
    $$slots,
  };
}
