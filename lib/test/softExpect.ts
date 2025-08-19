import { styleText } from "node:util";
import { expect } from "vitest";

type SoftExpectResult<T> = {
  toBe: (expected: T) => void;
  toEqual: (expected: T) => void;
};

/** Wrapper around {@linkcode expect()} that catches errors and logs them instead of throwing. */
export function softExpect<T>(actual: T): SoftExpectResult<T> {
  try {
    return expect(actual);
  } catch (err) {
    console.warn(styleText("yellow", "Soft assertion failed:"), err);
    return {
      toBe: () => {},
      toEqual: () => {},
    };
  }
}
