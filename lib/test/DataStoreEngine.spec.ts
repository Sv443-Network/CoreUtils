import { describe, expect, it } from "vitest";
import { access, readFile, writeFile } from "node:fs/promises";
import { FileStorageEngine, type FileStorageEngineOptions } from "../DataStoreEngine.ts";
import { DatedError } from "../Errors.ts";
import { DataStore } from "../DataStore.ts";
import { compress, decompress } from "../crypto.ts";

describe("FileStorageEngine", () => {
  //#region storage API

  it("Storage API works as expected", async () => {
    const defaultEngineOpts = {
      filePath: (_id, options) => `./test-data-${options?.id}.${options.encodeData && options.decodeData ? "dat" : "json"}`,
    } satisfies FileStorageEngineOptions;

    const engine = new FileStorageEngine({
      ...defaultEngineOpts,
      dataStoreOptions: {
        id: "test",
      },
    });

    const engine2 = new FileStorageEngine({
      ...defaultEngineOpts,
      dataStoreOptions: {
        id: "test2",
        encodeData: ["deflate-raw", (data) => compress(data, "deflate-raw", "string")],
        decodeData: ["deflate-raw", (data) => decompress(data, "deflate-raw", "string")],
      },
    });

    try {
      await engine.setValue("key", "val");
      await engine2.setValue("key", "val");

      expect(async () => await readFile("./test-data-test.json", "utf-8")).not.toThrow();
      expect(async () => await readFile("./test-data-test2.dat", "utf-8")).not.toThrow();

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
    }
    catch(e) {
      console.error("Test failed with error:", e);
      throw e;
    }
    finally {
      await engine.deleteStorage?.();
      await engine2.deleteStorage?.();
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

  //#region object format

  it("Stores JSON objects directly in file and reads legacy string format", async () => {
    const filePath = "./.test-data-obj-format";

    const engine = new FileStorageEngine({
      filePath,
      dataStoreOptions: { id: "test-obj-fmt" },
    });

    try {
      await engine.setValue("myData", '{"x":1,"y":2}');
      await engine.setValue("plainStr", "hello");
      await engine.setValue("num", 42);

      // verify raw file stores objects directly, not double-serialized as strings
      const raw = JSON.parse(await readFile(filePath, "utf-8"));
      expect(typeof raw.myData).toBe("object");
      expect(raw.myData).toEqual({ x: 1, y: 2 });
      expect(raw.plainStr).toBe("hello");
      expect(raw.num).toBe(42);

      // getValue should re-serialize objects back to strings for callers
      expect(await engine.getValue("myData", "default")).toBe('{"x":1,"y":2}');
      expect(await engine.getValue("plainStr", "default")).toBe("hello");
      expect(await engine.getValue("num", NaN)).toBe(42);

      // backward compat: manually write file in legacy format (data as string)
      await writeFile(filePath, JSON.stringify({
        myData: '{"x":1,"y":2}',
        plainStr: "hello",
        num: 42,
      }), "utf-8");

      // should still read correctly from the legacy format
      expect(await engine.getValue("myData", "default")).toBe('{"x":1,"y":2}');
      expect(await engine.getValue("plainStr", "default")).toBe("hello");
      expect(await engine.getValue("num", NaN)).toBe(42);
    }
    catch(e) {
      console.error("Test failed with error:", e);
      throw e;
    }
    finally {
      await engine.deleteStorage();
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

    expect(await storeUncomp.engine.getValue(`__ds_fmt_ver`,   NaN)).toBe(1);
    expect(await storeUncomp.engine.getValue(`__ds-${id}-ver`, NaN)).toBe(1);
    expect(await storeUncomp.engine.getValue(`__ds-${id}-enf`, NaN)).toBe(null);
    expect(await storeUncomp.engine.getValue(`__ds-${id}-dat`, NaN)).toEqual(defaultData);

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
