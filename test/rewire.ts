import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { transformSync } from "@babel/core";
import * as fs from "fs";
import { createContext, Script } from "vm";
import { basename, resolve } from "path";

function removeImports(code: string, filename: string) {
  const ast = parse(code, {
    plugins: ["typescript"],
    sourceType: "module",
  });
  traverse(ast, {
    ImportDeclaration: (nodePath) => {
      nodePath.remove();
    },
  });
  return generate(
    ast,
    {
      sourceMaps: true,
      sourceFileName: filename,
    },
    code
  );
}

function removeTypes(code: string, filename: string, inputSourceMap: any) {
  const result = transformSync(code, {
    filename,
    inputSourceMap,
    presets: ["@babel/preset-typescript"],
    sourceMaps: "inline",
  });
  return result;
}

export function rewire(srcPath: string): (globals: object) => unknown {
  const src = fs.readFileSync(srcPath, "utf-8");
  const srcFileName = basename(srcPath);

  const noImports = removeImports(src, srcFileName);
  const noTypes = removeTypes(noImports.code, srcFileName, noImports.map);

  const filename = resolve(srcPath).replace(".ts", ".js");

  const script = new Script(noTypes.code, { filename });
  return (globals: object) => {
    const exports = {};
    const context = createContext({ ...globals, exports });
    script.runInContext(context);
    return exports;
  };
}
