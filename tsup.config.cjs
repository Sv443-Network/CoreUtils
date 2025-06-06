import { defineConfig } from "tsup";
import umdWrapper from "esbuild-plugin-umd-wrapper";
import { dependencies } from "./package.json";
import { createUmdWrapper } from "./tools/umdWrapperPlugin.cjs";

/** @typedef {import('tsup').Options} TsupOptions */

const clientName = "CoreUtils";
const externalDependencies = Object.keys(dependencies);
const isDevelopmentMode = process.env.NODE_ENV === "development";

export default defineConfig((cliOpts) => {
  /** @type {TsupOptions} */
  const baseCfg = {
    entry: {
      [clientName]: "lib/index.ts",
    },
    outDir: "dist",
    outExtension({ format, options }) {
      return {
        js: `.${options.minify ? "min." : ""}${
          (() => {
            switch(format) {
            case "cjs": return "cjs";
            case "esm": return "mjs";
            case "umd": return "umd.js";
            }
          })()
        }`,
      };
    },
    platform: "browser",
    format: ["cjs", "esm"],
    noExternal: externalDependencies,
    target: ["chrome90", "edge90", "firefox90", "opera98", "safari15"],
    name: "@sv443-network/coreutils",
    globalName: clientName,
    legacyOutput: false,
    bundle: true,
    esbuildPlugins: [],
    minify: false,
    sourcemap: true,
    dts: false,
    clean: true,
    watch: cliOpts.watch,
    metafile: cliOpts.watch || isDevelopmentMode,
  };

  /** @type {TsupOptions[]} */
  return [
    baseCfg,
    {
      ...baseCfg,
      minify: true,
    },
    {
      ...baseCfg,
      format: ["umd"],
      minify: false,
      plugins: [createUmdWrapper({ libraryName: clientName, external: [] })],
    },
    {
      ...baseCfg,
      minify: true,
      format: ["umd"],
      plugins: [createUmdWrapper({ libraryName: clientName, external: [] })],
    },
    {
      ...baseCfg,
      entry: {
        [clientName]: "lib/index.ts",
      },
      minify: false,
      target: "es6",
      format: ["umd"],
      outputExtension: {
        js: "browser.js",
      },
      outDir: "dist",
      esbuildPlugins: [umdWrapper({ libraryName: clientName, external: "inherit" })],
      onSuccess: "tsc --emitDeclarationOnly --declaration --outDir dist && node --import tsx ./tools/fix-dts.mts",
    },
  ];
});
