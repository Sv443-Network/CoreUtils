import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: "v8",
      include: ["lib/**/*.ts"],
      exclude: [
        "lib/**/*.spec.ts",
        "lib/test/*.ts",
        "lib/TieredCache.ts",
        "lib/Translate.ts",
        "lib/index.ts",
      ],
      reporter: ["text", "text-summary", "lcov"],
    },
    include: ["lib/**/*.spec.ts"],
    environment: "jsdom",
    testTimeout: 10_000,
  },
});
