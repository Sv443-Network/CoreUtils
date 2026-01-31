import { describe, expect, it } from "vitest";
import { ChecksumMismatchError, DatedError, MigrationError, ValidationError } from "./Errors.ts";
import { valsWithin } from "./math.ts";

describe("Errors", () => {
  it("All class instances have the date property", () => {
    const classes = [
      ["DatedError", DatedError],
      ["ChecksumMismatchError", ChecksumMismatchError],
      ["MigrationError", MigrationError],
      ["ValidationError", ValidationError],
    ] as const;
    const errTime = Date.now();

    for(const [name, Cls] of classes) {
      const instance = new Cls(`Test ${name}`);
      expect(instance).toBeInstanceOf(Cls);
      expect(instance.name).toBe(name);
      expect(instance.message).toBe(`Test ${name}`);
      expect(instance.date).toBeInstanceOf(Date);
      expect(valsWithin(errTime, instance.date.getTime(), undefined, 100)).toBe(true);
    }
  });
});
