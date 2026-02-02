import { styleText } from "node:util";
import { expect, type Assertion } from "vitest";

/**
 * Run an assertion in "soft" mode: catch assertion errors and log them instead of throwing.
 *
 * @example ```ts
 * softExpect(() => expect(actual).toBe(42));
 * softExpect(actual, e => e.toBe(42), "optional message");
 * ```
 */
export function softExpect(assertion: () => void | unknown): void;
export function softExpect<T>(actual: T, assertion: (expectation: Assertion<T>) => void | unknown, message?: string): void;
export function softExpect<T>(
  actualOrAssertion: T | (() => void | unknown),
  assertionOrMessage?: ((expectation: Assertion<T>) => void | unknown) | string,
  maybeMessage?: string,
): void {
  try {
    if(typeof actualOrAssertion === "function") {
      // form: softExpect(() => expect(...).toBe(...));
      (actualOrAssertion as () => void)();
      return;
    }

    // form: softExpect(actual, e => e.toBe(...), "optional message");
    const actual = actualOrAssertion as T;
    let assertion: ((expectation: Assertion<T>) => void) | undefined;
    let message: string | undefined;

    if(typeof assertionOrMessage === "function") {
      assertion = assertionOrMessage as (expectation: Assertion<T>) => void;
      message = maybeMessage;
    }
    else {
      // no assertion callback provided; nothing to do.
      message = assertionOrMessage as string | undefined;
    }

    const expectation = expect(actual, message);
    assertion?.(expectation);
  }
  catch(err) {
    const message = maybeMessage || (typeof assertionOrMessage === "string" ? assertionOrMessage : undefined);
    const formattedMessage = message ? `Soft assertion failed: ${message}` : "Soft assertion failed";
    console.error(styleText("red", formattedMessage));
    console.error(err);
  }
}
