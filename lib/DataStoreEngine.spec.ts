import { describe, expect, it } from "vitest";
import { access, readFile } from "node:fs/promises";
import { FileStorageEngine } from "./DataStoreEngine";
import { DatedError } from "./Errors";

describe("FileStorageEngine", () => {
  //#region storage API

  it("Storage API works as expected", async () => {
    const engine = new FileStorageEngine({
      filePath: "./test-data",
      dataStoreOptions: {
        id: "test",
      },
    });

    await engine.setValue("key", "val");

    expect(await engine.getValue("key", "default")).toBe("val");
    expect(await engine.getValue("nonexistent", "default")).toBe("default");

    const foo = { bar: 1 };
    expect(engine.deepCopy(foo)).toEqual(foo);
    expect(engine.deepCopy(foo) === foo).toBe(false);

    await engine.deleteStorage();

    try {
      await access("./test-data");
      throw new Error("File should not exist");
    }
    catch(e) {
      expect((e as NodeJS.ErrnoException)?.code).toBe("ENOENT");
    }
  });

  //#region errors

  it("Throws when no DataStoreOptions are provided", async () => {
    try {
      const engine = new FileStorageEngine({ filePath: "./test-data" });
      await engine.setValue("key", "val");

      throw new Error("Should have thrown an error");
    }
    catch(e) {
      expect(e).toBeInstanceOf(DatedError);
    }

    try {
      // @ts-expect-error
      const engine = new FileStorageEngine({ filePath: "./test-data", dataStoreOptions: {} });
      await engine.setValue("key", "val");

      throw new Error("Should have thrown an error");
    }
    catch(e) {
      expect(e).toBeInstanceOf(DatedError);
    }
  });

  //#region w/o structuredClone

  it("Use JSON reserialize when structuredClone is not available", async () => {
    const originalStructuredClone = globalThis.structuredClone;
    // @ts-expect-error
    globalThis.structuredClone = undefined;

    const engine = new FileStorageEngine({
      filePath: "./test-data",
      dataStoreOptions: {
        id: "test",
      },
    });

    const foo = { bar: 1 };
    expect(engine.deepCopy(foo)).toEqual(foo);
    expect(engine.deepCopy(foo) === foo).toBe(false);

    globalThis.structuredClone = originalStructuredClone;
  });
});
