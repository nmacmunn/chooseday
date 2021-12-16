import { relative } from "path";

jest.unmock("path");

export default function Mocks<
  T extends Record<string, [string] | [string, string]>
>(dir: string, props: T): Record<keyof T, jest.Mock> {
  const rel = relative(dir, __dirname);
  const mocks = {};
  for (const [key, [file, prop]] of Object.entries(props)) {
    const moduleName = file.startsWith(".") ? relative(rel, file) : file;
    Object.defineProperty(mocks, key, {
      get: () => jest.requireMock(moduleName)[prop || key],
    });
  }
  return mocks;
}
