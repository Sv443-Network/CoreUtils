import { describe, expect, it } from "vitest";
import { ChecksumMismatchError, DatedError, MigrationError, ValidationError } from "./Errors.js";

describe("Errors", () => {
  it("All class instances have the date property", () => {
    const classes = [
      ["DatedError", DatedError],
      ["ChecksumMismatchError", ChecksumMismatchError],
      ["MigrationError", MigrationError],
      ["ValidationError", ValidationError],
    ] as const;

    for(const [name, Cls] of classes) {
      const instance = new Cls(`Test ${name}`);
      expect(instance).toBeInstanceOf(Cls);
      expect(instance.date).toBeInstanceOf(Date);
      expect(instance.message).toBe(`Test ${name}`);
      expect(instance.name).toBe(name);
    }
  });
});
