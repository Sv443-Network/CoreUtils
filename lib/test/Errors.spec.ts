import { describe, expect, it } from "vitest";
import { ChecksumMismatchError, CustomError, DatedError, MigrationError, ValidationError } from "../Errors.js";
import { valsWithin } from "../math.js";

describe("Errors", () => {
  it("All class instances have the date property", () => {
    const classes = [
      ["DatedError", "class", DatedError],
      ["ChecksumMismatchError", "class", ChecksumMismatchError],
      ["TestCustomError", "fn", (msg: string) => new CustomError("TestCustomError", msg), CustomError],
      ["MigrationError", "class", MigrationError],
      ["ValidationError", "class", ValidationError],
    ] as const;
    const errTime = Date.now();

    for(const [name, type, Cls, OrigCls] of classes) {
      const instance = type === "fn"
        ? Cls(`Test ${name}`)
        : new Cls(`Test ${name}`);

      expect(instance).toBeInstanceOf(type === "class" ? Cls : OrigCls);
      expect(instance.name).toBe(name);
      expect(instance.message).toBe(`Test ${name}`);
      expect(instance.date).toBeInstanceOf(Date);
      expect(valsWithin(errTime, instance.date.getTime(), undefined, 50)).toBe(true);
    }
  });
});
