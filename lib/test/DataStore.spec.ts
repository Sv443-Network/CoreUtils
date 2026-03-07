import { describe, expect, it, vi } from "vitest";
import { DataStore } from "../DataStore.ts";
import { BrowserStorageEngine, DataStoreEngine } from "../DataStoreEngine.ts";
import type { SerializableVal } from "../types.ts";
import { DirectAccessDataStore } from "./DirectAccessDataStore.ts";
import { randomId } from "../crypto.ts";
import { MigrationError } from "../Errors.ts";

//#region >> tests

describe("DataStore", () => {
  //#region base
  it("Basic usage", async () => {
    const store = new DataStore({
      id: "test-1",
      defaultData: { a: 1, b: 2 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
      encodeData: ["identity", (d) => d],
      decodeData: ["identity", (d) => d],
    });

    // should equal defaultData:
    expect(store.getData().a).toBe(1);

    await store.loadData();

    // synchronous in-memory change:
    const prom = store.setData({ ...store.getData(), a: 2 });

    expect(store.getData().a).toBe(2);

    await prom;

    // only clears persistent data, not the stuff in memory:
    await store.deleteData();
    expect(store.getData().a).toBe(2);

    // refreshes memory data:
    await store.loadData();
    expect(store.getData().a).toBe(1);

    expect(store.encodingEnabled()).toBe(true);

    // restore initial state:
    await store.deleteData();
  });

  //#region encoding
  it("Works with encoding", async () => {
    const store = new DataStore({
      id: "test-2",
      defaultData: { a: 1, b: 2 },
      formatVersion: 1,
      engine: new BrowserStorageEngine(),
      // uses deflate-raw by default
    });

    await store.loadData();

    await store.setData({ ...store.getData(), a: 2 });

    await store.loadData();

    expect(store.getData()).toEqual({ a: 2, b: 2 });

    expect(store.encodingEnabled()).toBe(true);

    // restore initial state:
    await store.deleteData();
  });

  //#region data & ID migrations
  it("Data and ID migrations work", async () => {
    const firstStore = new DataStore({
      id: "test-3",
      defaultData: { a: 1, b: 2 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
    });

    await firstStore.loadData();

    await firstStore.setData({ ...firstStore.getData(), a: 2 });

    // new store with increased format version & new ID:
    const secondStore = new DataStore({
      id: "test-4",
      migrateIds: [firstStore.id],
      defaultData: { a: -1337, b: -1337, c: 69 },
      formatVersion: 2,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      migrations: {
        2: (oldData: Record<string, unknown>) => ({ ...oldData, c: 1 }),
      },
    });

    const data1 = await secondStore.loadData();

    expect(data1.a).toBe(2);
    expect(data1.b).toBe(2);
    expect(data1.c).toBe(1);

    await secondStore.saveDefaultData();
    const data2 = secondStore.getData();

    expect(data2.a).toBe(-1337);
    expect(data2.b).toBe(-1337);
    expect(data2.c).toBe(69);

    // migrate with migrateId method:
    const thirdStore = new DirectAccessDataStore({
      id: "test-5",
      defaultData: secondStore.defaultData,
      formatVersion: 3,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
    });

    await thirdStore.migrateId(secondStore.id);
    const thirdData = await thirdStore.loadData();

    expect(thirdData.a).toBe(-1337);
    expect(thirdData.b).toBe(-1337);
    expect(thirdData.c).toBe(69);

    expect(await thirdStore.direct_getValue("__ds-test-5-ver", "error")).toBe("2");
    await thirdStore.setData(thirdStore.getData());
    expect(await thirdStore.direct_getValue("__ds-test-5-ver", "error")).toBe("3");

    expect(await thirdStore.direct_getValue("__ds-test-3-ver", "error")).toBe(null);
    expect(await thirdStore.direct_getValue("__ds-test-4-ver", "error")).toBe(null);

    // restore initial state:
    await firstStore.deleteData();
    await secondStore.deleteData();
    await thirdStore.deleteData();
  });

  //#region migration error
  it("Migration error", async () => {
    const store1 = new DataStore({
      id: "test-migration-error",
      defaultData: { a: 1, b: 2 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
    });

    await store1.loadData();

    const store2 = new DataStore({
      id: "test-migration-error",
      defaultData: { a: 5, b: 5, c: 5 },
      formatVersion: 2,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
      migrations: {
        2: (_oldData: typeof store1["defaultData"]) => {
          throw new Error("Some error in the migration function");
        },
      },
    });

    // should reset to defaultData, because of the migration error:
    await store2.loadData();

    expect(store2.getData().a).toBe(5);
    expect(store2.getData().b).toBe(5);
    expect(store2.getData().c).toBe(5);
  });

  //#region migrate from UU-v9 format
  it("Migrate from UU-v9 format", async () => {
    const store1 = new DirectAccessDataStore({
      id: "test-migrate-from-uu-v9",
      defaultData: { a: 1, b: 2 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
      compressionFormat: null,
    });

    await store1.loadData();
    store1.direct_setFirstInit(true);

    await store1.direct_deleteValue("__ds_fmt_ver");
    await store1.direct_renameKey(`__ds-${store1.id}-dat`, `_uucfg-${store1.id}`);
    await store1.direct_renameKey(`__ds-${store1.id}-ver`, `_uucfgver-${store1.id}`);
    await store1.direct_deleteValue(`__ds-${store1.id}-enf`);
    await store1.direct_setValue(`_uucfgenc-${store1.id}`, false);

    expect(await store1.direct_getValue(`__ds-${store1.id}-ver`, null)).toBeNull();
    expect(await store1.direct_getValue(`__ds-${store1.id}-enf`, null)).toBeNull();
    expect(await store1.direct_getValue(`_uucfg-${store1.id}`, null)).not.toBeNull();

    await store1.loadData();

    expect(await store1.direct_getValue(`__ds-${store1.id}-ver`, null)).toBe("1");
    expect(await store1.direct_getValue(`__ds-${store1.id}-enf`, null)).not.toBeNull();
    // old keys should be deleted after migration:
    expect(await store1.direct_getValue(`_uucfg-${store1.id}`, null)).toBeNull();
    expect(await store1.direct_getValue(`_uucfgver-${store1.id}`, null)).toBeNull();
    expect(await store1.direct_getValue(`_uucfgenc-${store1.id}`, null)).toBeNull();
    expect(store1.getData()).toEqual({ a: 1, b: 2 });

    // restore initial state:
    await store1.deleteData();
    await store1.direct_deleteValue("__ds_fmt_ver");
  });

  //#region migrate multiple stores from UU-v9
  it("Migrate multiple stores from UU-v9 format", async () => {
    const engine = new BrowserStorageEngine({ type: "localStorage" });

    // first set up two stores with data:
    const storeA = new DirectAccessDataStore({
      id: "test-multi-uu-v9-a",
      defaultData: { x: 10 },
      formatVersion: 1,
      engine,
      compressionFormat: null,
    });
    const storeB = new DirectAccessDataStore({
      id: "test-multi-uu-v9-b",
      defaultData: { y: 20, migrated: false },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
      compressionFormat: null,
    });

    await storeA.loadData();
    await storeB.loadData();
    await storeA.setData({ x: 42 });
    await storeB.setData({ y: 99, migrated: false });

    // simulate UU v9 format by renaming keys and clearing __ds_fmt_ver:
    for(const store of [storeA, storeB]) {
      store.direct_setFirstInit(true);
      await store.direct_renameKey(`__ds-${store.id}-dat`, `_uucfg-${store.id}`);
      await store.direct_renameKey(`__ds-${store.id}-ver`, `_uucfgver-${store.id}`);
      await store.direct_deleteValue(`__ds-${store.id}-enf`);
      await store.direct_setValue(`_uucfgenc-${store.id}`, false);
    }
    await storeA.direct_deleteValue("__ds_fmt_ver");

    // now create new stores that should migrate from the old format:
    const newA = new DirectAccessDataStore({
      id: "test-multi-uu-v9-a",
      defaultData: { x: -1 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
      compressionFormat: null,
    });
    const newB = new DirectAccessDataStore({
      id: "test-multi-uu-v9-b",
      defaultData: { y: -1, migrated: false },
      formatVersion: 2,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
      compressionFormat: null,
      migrations: {
        2: (old: Record<string, unknown>) => ({ ...old, migrated: true }),
      },
    });

    // load A first (sets __ds_fmt_ver = 1), then B should still migrate:
    const dataA = await newA.loadData();
    expect(dataA).toEqual({ x: 42 });

    const dataB = await newB.loadData();
    expect(dataB).toEqual({ y: 99, migrated: true });

    // all old keys should be deleted:
    expect(await newA.direct_getValue(`_uucfg-${newA.id}`, null)).toBeNull();
    expect(await newA.direct_getValue(`_uucfgver-${newA.id}`, null)).toBeNull();
    expect(await newA.direct_getValue(`_uucfgenc-${newA.id}`, null)).toBeNull();
    expect(await newB.direct_getValue(`_uucfg-${newB.id}`, null)).toBeNull();
    expect(await newB.direct_getValue(`_uucfgver-${newB.id}`, null)).toBeNull();
    expect(await newB.direct_getValue(`_uucfgenc-${newB.id}`, null)).toBeNull();

    // restore initial state:
    await newA.deleteData();
    await newB.deleteData();
    await newA.direct_deleteValue("__ds_fmt_ver");
  });

  //#region invalid persistent data
  it("Invalid persistent data", async () => {
    const store1 = new DirectAccessDataStore({
      id: "test-6",
      defaultData: { a: 1, b: 2 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
    });

    await store1.loadData();
    await store1.setData({ ...store1.getData(), a: 2 });

    await store1.direct_setValue(`__ds-${store1.id}-dat`, "invalid_json");

    try {
      // should reset to defaultData:
      await store1.loadData();
    }
    catch (err) {
      expect(err).toBeInstanceOf(Error);
      if(err instanceof Error)
        expect(err.message).toContain("parsing JSON");
    }

    expect(store1.getData().a).toBe(1);
    expect(store1.getData().b).toBe(2);

    // @ts-expect-error
    window.GM = {
      getValue: async () => 1337,
      setValue: async () => undefined,
    }

    const store2 = new DirectAccessDataStore({
      id: "test-7",
      defaultData: { a: 1, b: 2 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
    });

    await store1.setData({ ...store1.getData(), a: 2 });

    // invalid type number should reset to defaultData
    // note: this logs an error to the console which can be ignored
    await store2.loadData();

    expect(store2.getData().a).toBe(1);
    expect(store2.getData().b).toBe(2);

    // @ts-expect-error
    delete window.GM;
  });

  //#region without memcache
  it("Works as expected with no in-mem cache", async () => {
    const store = new DirectAccessDataStore({
      id: "test-no-in-mem-cache",
      defaultData: { a: 1, b: 2 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
      memoryCache: false,
    });

    // should default to {} if memoryCache is disabled:
    expect(Object.keys(store.direct_getMemData()).length).toBe(0);

    // should throw (and is a type error when memoryCache is false):
    expect(() => {
      // @ts-expect-error - getData() is unavailable when memoryCache is false
      store.getData();
    }).toThrow();
  });

  it("No type error when using interface without index signature", async () => {
    interface MyData {
      a: number;
      b: number;
    }

    const defaultData: MyData = { a: 1, b: 2 };

    const store = new DataStore({
      id: "test-interface-without-index-signature",
      defaultData,
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
    });

    await store.loadData();

    expect(store.getData().a).toBe(1);
    expect(store.getData().b).toBe(2);

    await store.setData({ ...store.getData(), a: 42 });

    await store.loadData();

    expect(store.getData().a).toBe(42);
    expect(store.getData().b).toBe(2);

    // restore initial state:
    await store.deleteData();
  });

  //#region custom key prefix
  it("Supports custom key prefix", async () => {
    const randId = randomId(8, 36);
    const store1 = new DataStore({
      id: "test-custom-key-prefix-1",
      defaultData: { a: 1, b: 2 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
      keyPrefix: `${randId}-`,
    });
    const store2 = new DataStore({
      id: "test-custom-key-prefix-2",
      defaultData: { a: 1, b: 2 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "localStorage" }),
      keyPrefix: "",
    });

    await store1.loadData();
    await store1.setData({ ...store1.getData(), a: 2 });

    expect(await store1.engine.getValue(`${randId}-test-custom-key-prefix-1-dat`, null)).not.toBeNull();

    await store2.loadData();
    await store2.setData({ ...store2.getData(), a: 2 });

    expect(await store2.engine.getValue(`test-custom-key-prefix-2-dat`, null)).not.toBeNull();

    // restore initial state:
    await store1.deleteData();
    await store2.deleteData();
  });

  //#region events

  it("Emits loadData event on successful load", async () => {
    const store = new DataStore({
      id: "test-evt-loadData",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
    });

    const cb = vi.fn();
    store.on("loadData", cb);

    await store.loadData();

    expect(cb).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledWith({ a: 1 });

    await store.setData({ a: 2 });
    await store.loadData();

    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenLastCalledWith({ a: 2 });

    await store.deleteData();
  });

  it("Emits updateData and updateDataSync events on setData", async () => {
    const store = new DataStore({
      id: "test-evt-updateData",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
    });

    await store.loadData();

    const syncCb = vi.fn();
    const asyncCb = vi.fn();
    store.on("updateDataSync", syncCb);
    store.on("updateData", asyncCb);

    await store.setData({ a: 42 });

    expect(syncCb).toHaveBeenCalledOnce();
    expect(syncCb).toHaveBeenCalledWith({ a: 42 });
    expect(asyncCb).toHaveBeenCalledOnce();
    expect(asyncCb).toHaveBeenCalledWith({ a: 42 });

    await store.deleteData();
  });

  it("Does not emit updateDataSync when memoryCache is disabled", async () => {
    const store = new DataStore({
      id: "test-evt-no-sync",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
      memoryCache: false,
    });

    await store.loadData();

    const syncCb = vi.fn();
    const asyncCb = vi.fn();
    store.on("updateDataSync", syncCb);
    store.on("updateData", asyncCb);

    await store.setData({ a: 42 });

    expect(syncCb).not.toHaveBeenCalled();
    expect(asyncCb).toHaveBeenCalledOnce();

    await store.deleteData();
  });

  it("Emits setDefaultData on saveDefaultData but not on initial population", async () => {
    const store = new DataStore({
      id: "test-evt-setDefault",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
    });

    const cb = vi.fn();
    store.on("setDefaultData", cb);

    // initial population should NOT emit setDefaultData:
    await store.loadData();
    expect(cb).not.toHaveBeenCalled();

    // explicit call should emit:
    await store.saveDefaultData();
    expect(cb).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledWith({ a: 1 });

    await store.deleteData();
  });

  it("Emits deleteData event", async () => {
    const store = new DataStore({
      id: "test-evt-delete",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
    });

    await store.loadData();

    const cb = vi.fn();
    store.on("deleteData", cb);

    await store.deleteData();

    expect(cb).toHaveBeenCalledOnce();
  });

  it("Emits migrateData and updateData events during migrations", async () => {
    const store1 = new DataStore({
      id: "test-evt-migrate",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
    });
    await store1.loadData();

    const store2 = new DataStore({
      id: "test-evt-migrate",
      defaultData: { a: 1, b: 2, c: 3 },
      formatVersion: 3,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
      migrations: {
        2: (old: Record<string, unknown>) => ({ ...old, b: 2 }),
        3: (old: Record<string, unknown>) => ({ ...old, c: 3 }),
      },
    });

    const migCb = vi.fn();
    const updateCb = vi.fn();
    store2.on("migrateData", migCb);
    store2.on("updateData", updateCb);

    await store2.loadData();

    expect(migCb).toHaveBeenCalledTimes(2);
    expect(migCb).toHaveBeenNthCalledWith(1, 2, { a: 1, b: 2 }, false);
    expect(migCb).toHaveBeenNthCalledWith(2, 3, { a: 1, b: 2, c: 3 }, true);
    // updateData emitted once after all migrations are saved:
    expect(updateCb).toHaveBeenCalled();

    await store2.deleteData();
  });

  it("Emits migrationError and error events on migration failure", async () => {
    const store1 = new DataStore({
      id: "test-evt-migErr",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
    });
    await store1.loadData();

    const store2 = new DataStore({
      id: "test-evt-migErr",
      defaultData: { a: 5 },
      formatVersion: 2,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
      migrations: {
        2: () => { throw new Error("boom"); },
      },
    });

    const migErrCb = vi.fn();
    const errCb = vi.fn();
    const setDefaultCb = vi.fn();
    store2.on("migrationError", migErrCb);
    store2.on("error", errCb);
    store2.on("setDefaultData", setDefaultCb);

    await store2.loadData();

    expect(migErrCb).toHaveBeenCalledOnce();
    expect(migErrCb.mock.calls[0]![0]).toBe(2);
    expect(migErrCb.mock.calls[0]![1]).toBeInstanceOf(MigrationError);

    expect(errCb).toHaveBeenCalledOnce();
    expect(errCb.mock.calls[0]![0]).toBeInstanceOf(MigrationError);

    // saveDefaultData is called on migration error reset, so setDefaultData should emit:
    expect(setDefaultCb).toHaveBeenCalledOnce();

    await store2.deleteData();
  });

  it("Emits error event when loadData encounters invalid data", async () => {
    const store = new DirectAccessDataStore({
      id: "test-evt-loadErr",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
    });

    await store.loadData();
    await store.direct_setValue(`__ds-${store.id}-dat`, "invalid_json");

    const errCb = vi.fn();
    const setDefaultCb = vi.fn();
    store.on("error", errCb);
    store.on("setDefaultData", setDefaultCb);

    await store.loadData();

    expect(errCb).toHaveBeenCalledOnce();
    expect(errCb.mock.calls[0]![0]).toBeInstanceOf(Error);

    expect(setDefaultCb).toHaveBeenCalledOnce();

    await store.deleteData();
  });

  it("Emits migrateId event on ID migration", async () => {
    const oldStore = new DataStore({
      id: "test-evt-oldId",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
    });
    await oldStore.loadData();
    await oldStore.setData({ a: 99 });

    const newStore = new DataStore({
      id: "test-evt-newId",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new BrowserStorageEngine({ type: "sessionStorage" }),
      compressionFormat: null,
      migrateIds: ["test-evt-oldId"],
    });

    const cb = vi.fn();
    newStore.on("migrateId", cb);

    await newStore.loadData();

    expect(cb).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledWith("test-evt-oldId", "test-evt-newId");

    await newStore.deleteData();
  });

  //#region setData error

  it("Emits error event when setData fails", async () => {
    class FailingEngine extends DataStoreEngine {
      public async getValue<TValue extends SerializableVal = string>(_name: string, defaultValue: TValue): Promise<string | TValue> {
        return defaultValue;
      }
      public async setValue(_name: string, _value: SerializableVal): Promise<void> {
        throw new Error("setValue failed");
      }
      public async deleteValue(_name: string): Promise<void> {}
    }

    const store = new DataStore({
      id: "test-evt-setData-err",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new FailingEngine(),
      compressionFormat: null,
    });

    const errCb = vi.fn();
    const updateCb = vi.fn();
    store.on("error", errCb);
    store.on("updateData", updateCb);

    await store.setData({ a: 2 });

    expect(errCb).toHaveBeenCalledOnce();
    expect(errCb.mock.calls[0]![0]).toBeInstanceOf(Error);
    expect(updateCb).not.toHaveBeenCalled();
  });

  it("Emits error event when saveDefaultData IO fails", async () => {
    class FailingEngine extends DataStoreEngine {
      public async getValue<TValue extends SerializableVal = string>(_name: string, defaultValue: TValue): Promise<string | TValue> {
        return defaultValue;
      }
      public async setValue(_name: string, _value: SerializableVal): Promise<void> {
        throw new Error("setValue failed");
      }
      public async deleteValue(_name: string): Promise<void> {}
    }

    const store = new DataStore({
      id: "test-evt-saveDefault-err",
      defaultData: { a: 1 },
      formatVersion: 1,
      engine: new FailingEngine(),
      compressionFormat: null,
    });

    const errCb = vi.fn();
    const setDefaultCb = vi.fn();
    store.on("error", errCb);
    store.on("setDefaultData", setDefaultCb);

    await store.saveDefaultData();

    expect(errCb).toHaveBeenCalledOnce();
    expect(errCb.mock.calls[0]![0]).toBeInstanceOf(Error);
    expect(setDefaultCb).not.toHaveBeenCalled();
  });
});
