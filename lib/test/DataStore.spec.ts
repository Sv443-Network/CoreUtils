import { describe, expect, it } from "vitest";
import { DataStore, type DataStoreData } from "../DataStore.js";
import { BrowserStorageEngine } from "../DataStoreEngine.js";
import type { SerializableVal } from "../types.js";

//#region DirectAccessDataStore

/** Wrapper around {@link DataStore} to allow direct access to the engine methods for testing purposes. */
class DirectAccessDataStore<TData extends DataStoreData> extends DataStore<TData> {
  public async direct_getValue<TValue extends SerializableVal = string>(name: string, defaultValue: TValue): Promise<string | TValue> {
    return await this.engine.getValue(name, defaultValue);
  }

  public async direct_setValue(name: string, value: SerializableVal): Promise<void> {
    return await this.engine.setValue(name, value);
  }

  public async direct_renameKey(oldName: string, newName: string): Promise<void> {
    const value = await this.engine.getValue(oldName, null);
    if(value) {
      await this.engine.setValue(newName, value);
      await this.engine.deleteValue(oldName);
    }
  }

  public async direct_deleteValue(name: string): Promise<void> {
    return await this.engine.deleteValue(name);
  }

  public setFirstInit(value: boolean): void {
    this.firstInit = value;
  }
}

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

    expect(await thirdStore.direct_getValue("__ds-test-5-ver", "")).toBe("2");
    await thirdStore.setData(thirdStore.getData());
    expect(await thirdStore.direct_getValue("__ds-test-5-ver", "")).toBe("3");

    expect(await thirdStore.direct_getValue("__ds-test-3-ver", "")).toBe("");
    expect(await thirdStore.direct_getValue("__ds-test-4-ver", "")).toBe("");

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
    });

    await store1.loadData();
    store1.setFirstInit(true);

    await store1.direct_deleteValue("__ds_fmt_ver");
    await store1.direct_renameKey(`__ds-${store1.id}-dat`, `_uucfg-${store1.id}`);
    await store1.direct_renameKey(`__ds-${store1.id}-ver`, `_uucfgver-${store1.id}`);
    await store1.direct_renameKey(`__ds-${store1.id}-enc`, `_uucfgenc-${store1.id}`);

    // let key: string | null, i = 0;
    // while((key = globalThis.localStorage.key(i)) !== null) {
    //   console.log(key, globalThis.localStorage.getItem(key));
    //   i++;
    // }

    expect(await store1.direct_getValue(`__ds-${store1.id}-ver`, null)).toBeNull();
    await store1.loadData();
    expect(await store1.direct_getValue(`__ds-${store1.id}-ver`, null)).toBe("1");
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
});
