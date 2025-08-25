import { describe, expect, it } from "vitest";
import { ChecksumMismatchError, CustomError, DatedError, MigrationError, NetworkError, ScriptContextError, ValidationError } from "../Errors.js";
import { valsWithin } from "../math.js";

describe("Errors", () => {
  it("All class instances have the date property", () => {
    const classes = [
      ["DatedError", "class", DatedError],
      ["ChecksumMismatchError", "class", ChecksumMismatchError],
      ["TestCustomError", "fn", (msg: string, opts?: ErrorOptions) => new CustomError("TestCustomError", msg, opts), CustomError],
      ["MigrationError", "class", MigrationError],
      ["ValidationError", "class", ValidationError],
      ["ScriptContextError", "class", ScriptContextError],
      ["NetworkError", "class", NetworkError],
    ] as const;
    const errTime = Date.now();

    for(const [name, type, Cls, OrigCls] of classes) {
      const errName = `Test ${name}`;
      const errOpts: ErrorOptions = { cause: new CustomError("InnerError", "x") };

      const instance = type === "fn"
        ? Cls(errName, errOpts)
        : new Cls(errName, errOpts);

      expect(instance).toBeInstanceOf(type === "class" ? Cls : OrigCls);
      expect(instance.name).toBe(name);
      expect(instance.message).toBe(`Test ${name}`);
      expect(instance.date).toBeInstanceOf(Date);
      expect(instance.cause).toBe(errOpts.cause);
      expect(valsWithin(errTime, instance.date.getTime(), undefined, 50)).toBe(true);
    }
  });
});
