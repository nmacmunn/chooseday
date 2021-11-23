import { readable } from "svelte/store";

export function delay() {
  return readable(false, (set) => {
    setTimeout(() => set(true), 500);
  });
}
