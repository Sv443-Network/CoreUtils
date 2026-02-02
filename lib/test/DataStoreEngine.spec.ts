import { describe, expect, it } from "vitest";
import { access } from "node:fs/promises";
import { FileStorageEngine } from "../DataStoreEngine.ts";
import { DatedError } from "../Errors.ts";
import { DataStore } from "../DataStore.ts";

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
      expect(await engine.setValue("key", "val")).toThrow(DatedError);
    }
    catch {}

    try {
      // @ts-expect-error
      const engine = new FileStorageEngine({ filePath: "./test-data", dataStoreOptions: {} });
      expect(await engine.setValue("key", "val")).toThrow(DatedError);
    }
    catch {}
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
    expect(JSON.stringify(engine.deepCopy(foo))).toEqual(JSON.stringify(foo));
    expect(engine.deepCopy(foo) === foo).toBe(false);

    globalThis.structuredClone = originalStructuredClone;
  });
});

describe("Full DataStore integration test", () => {
  it("Initializes the storage correctly", async () => {
    const id = "integration-test-uncompressed";
    const defaultData = { a: 1, b: 2 };
    const storeUncomp = new DataStore({
      id,
      defaultData,
      formatVersion: 1,
      engine: () => new FileStorageEngine({
        filePath: (id) => `./.test-data-${id}`,
      }),
      compressionFormat: null,
    });

    const data = await storeUncomp.loadData();

    expect(data).toEqual(defaultData);

    // parse file manually and check for contents:
    // __ds_fmt_ver = 1
    // __ds-integration-test-uncompressed-ver = 1
    // __ds-integration-test-uncompressed-enf = null
    // __ds-integration-test-uncompressed-dat = {"a":1,"b":2}

    expect(await storeUncomp.engine.getValue(`__ds_fmt_ver`, "error")).toBe(1);
    expect(await storeUncomp.engine.getValue(`__ds-${id}-ver`, "error")).toBe(1);
    expect(await storeUncomp.engine.getValue(`__ds-${id}-enf`, "error")).toBe(null);
    expect(await storeUncomp.engine.getValue(`__ds-${id}-dat`, "error")).toBe(JSON.stringify(defaultData));

    const newData = { a: 3, b: 4 };

    await storeUncomp.setData(newData);

    expect(await storeUncomp.engine.getValue(`__ds-${id}-dat`, "error")).toBe(JSON.stringify(newData));

    await storeUncomp.engine.deleteStorage?.();

    expect(await storeUncomp.engine.getValue(`__ds_fmt_ver`, "error")).toBe("error");
    expect(await storeUncomp.engine.getValue(`__ds-${id}-ver`, "error")).toBe("error");
    expect(await storeUncomp.engine.getValue(`__ds-${id}-enf`, "error")).toBe("error");
    expect(await storeUncomp.engine.getValue(`__ds-${id}-dat`, "error")).toBe("error");
  });
});
