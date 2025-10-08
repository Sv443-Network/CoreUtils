import { styleText } from "node:util";
import { expect, type Assertion } from "vitest";

/** Wrapper around {@linkcode expect()} that catches errors and logs them instead of throwing. */
export function softExpect<T>(actual: T, message?: string): Assertion<T> | undefined {
  try {
    return expect(actual, message);
  } catch (err) {
    console.warn(styleText("yellow", "Soft assertion failed:"), err);
  }
}
