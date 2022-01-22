import { interpolateCool, interpolateWarm } from "d3-scale-chromatic";

export function getCool(index: number, length: number) {
  return interpolateCool((index + 1) / (length + 1));
}

export function getWarm(index: number, length: number) {
  return interpolateWarm((index + 1) / (length + 1));
}
