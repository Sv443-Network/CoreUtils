/**
 * @module DataStore
 * This module contains the DataStore class, which is a general purpose, sync and async persistent database for JSON-serializable data - [see the documentation for more info](https://github.com/Sv443-Network/DJSUtils/blob/main/docs.md#class-datastore)
 */

import { MigrationError } from "./Errors.js";
import type { DataStoreEngine } from "./DataStoreEngine.js";
import type { Prettify, SerializableVal } from "./types.js";

//#region types

/** Function that takes the data in the old format and returns the data in the new format. Also supports an asynchronous migration. */
type MigrationFunc = (oldData: any) => any | Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Dictionary of format version numbers and the function that migrates to them from the previous whole integer */
export type DataMigrationsDict = Record<number, MigrationFunc>;

/** Options for the DataStore instance */
export type DataStoreOptions<TData extends object> = Prettify<
  & {
    /**
     * A unique internal ID for this data store.  
     * To avoid conflicts with other scripts, it is recommended to use a prefix that is unique to your script.  
     * If you want to change the ID, you should make use of the {@linkcode DataStore.migrateId()} method.
     */
    id: string;
    /**
     * The default data object to use if no data is saved in persistent storage yet.  
     * Until the data is loaded from persistent storage with {@linkcode DataStore.loadData()}, this will be the data returned by {@linkcode DataStore.getData()}.  
     *   
     * - ⚠️ This has to be an object that can be serialized to JSON using `JSON.stringify()`, so no functions or circular references are allowed, they will cause unexpected behavior.  
     */
    defaultData: TData;
    /**
     * An incremental, whole integer version number of the current format of data.  
     * If the format of the data is changed in any way, this number should be incremented, in which case all necessary functions of the migrations dictionary will be run consecutively.  
     *   
     * - ⚠️ Never decrement this number and optimally don't skip any numbers either!
     */
    formatVersion: number;
    /**
     * A dictionary of functions that can be used to migrate data from older versions to newer ones.  
     * The keys of the dictionary should be the format version that the functions can migrate to, from the previous whole integer value.  
     * The values should be functions that take the data in the old format and return the data in the new format.  
     * The functions will be run in order from the oldest to the newest version.  
     * If the current format version is not in the dictionary, no migrations will be run.
     */
    migrations?: DataMigrationsDict;
    /**
     * If an ID or multiple IDs are passed here, the data will be migrated from the old ID(s) to the current ID.  
     * This will happen once per page load, when {@linkcode DataStore.loadData()} is called.  
     * All future calls to {@linkcode DataStore.loadData()} in the session will not check for the old ID(s) anymore.  
     * To migrate IDs manually, use the method {@linkcode DataStore.migrateId()} instead.
     */
    migrateIds?: string | string[];
    /**
     * The engine middleware to use for persistent storage.  
     * Create an instance of {@linkcode JSONFileEngine} (Node.js), {@linkcode BrowserStorageEngine} (DOM) or your own engine class that extends {@linkcode DataStoreEngine} and pass it here.  
     *   
     * ⚠️ Don't reuse the same engine instance for multiple DataStores, unless it explicitly supports it!
     */
    storageEngine: (() => DataStoreEngine<TData>) | DataStoreEngine<TData>;
  }
  & (
    // make sure that encodeData and decodeData are *both* either defined or undefined
    | {
      /**
       * Function to use to encode the data prior to saving it in persistent storage.  
       * If this is specified, make sure to declare {@linkcode decodeData()} as well.  
       *   
       * You can make use of UserUtils' [`compress()`](https://github.com/Sv443-Network/UserUtils?tab=readme-ov-file#compress) function here to make the data use up less space at the cost of a little bit of performance.
       * @param data The input data as a serialized object (JSON string)
       */
      encodeData: (data: string) => string | Promise<string>,
      /**
       * Function to use to decode the data after reading it from persistent storage.  
       * If this is specified, make sure to declare {@linkcode encodeData()} as well.  
       *   
       * You can make use of UserUtils' [`decompress()`](https://github.com/Sv443-Network/UserUtils?tab=readme-ov-file#decompress) function here to make the data use up less space at the cost of a little bit of performance.
       * @returns The resulting data as a valid serialized object (JSON string)
       */
      decodeData: (data: string) => string | Promise<string>,
    }
    | {
      encodeData?: never,
      decodeData?: never,
    }
  )
>;

//#region class

/** Current version of the general DataStore format (mostly referring to keys in persistent storage) */
const dsFmtVer = 1;

/** Whether this is the first time a DataStore instance is created in this environment */
let firstInit = true;

/**
 * Manages a hybrid synchronous & asynchronous persistent JSON database that is cached in memory and persistently saved across sessions using one of the preset DataStoreEngines or your own one.  
 * Supports migrating data from older format versions to newer ones and populating the cache with default data if no persistent data is found.  
 * Can be overridden to implement any other storage method.  
 *   
 * All methods are `protected` or `public`, so you can easily extend this class and overwrite them to use a different storage method or to add other functionality.  
 * Remember that you can use `super.methodName()` in the subclass to call the original method if needed.  
 *   
 * - ⚠️ The data is stored as a JSON string, so only data compatible with [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) can be used. Circular structures and complex objects (containing functions, symbols, etc.) will either throw an error on load and save or cause otherwise unexpected behavior. Properties with a value of `undefined` will be removed from the data prior to saving it, so use `null` instead.  
 * - ⚠️ Make sure to call {@linkcode loadData()} at least once after creating an instance, or the returned data will be the same as `options.defaultData`  
 * 
 * @template TData The type of the data that is saved in persistent storage for the currently set format version (FIXME:will be automatically inferred from `defaultData` if not provided)
 */
export class DataStore<TData extends object = object> {
  public readonly id: string;
  public readonly formatVersion: number;
  public readonly defaultData: TData;
  public readonly encodeData: DataStoreOptions<TData>["encodeData"];
  public readonly decodeData: DataStoreOptions<TData>["decodeData"];
  public readonly engine;
  private cachedData: TData;
  private migrations?: DataMigrationsDict;
  private migrateIds: string[] = [];

  /**
   * Creates an instance of DataStore to manage a sync & async database that is cached in memory and persistently saved across sessions.  
   * Supports migrating data from older versions to newer ones and populating the cache with default data if no persistent data is found.  
   *   
   * - ⚠️ Requires the directives `@grant GM.getValue` and `@grant GM.setValue` if the storageMethod is left as the default of `"GM"`  
   * - ⚠️ Make sure to call {@linkcode loadData()} at least once after creating an instance, or the returned data will be the same as `options.defaultData`
   * 
   * @template TData The type of the data that is saved in persistent storage for the currently set format version (will be automatically inferred from `defaultData` if not provided) - **This has to be a JSON-compatible object!** (no undefined, circular references, etc.)
   * @param opts The options for this DataStore instance
   */
  constructor(opts: DataStoreOptions<TData>) {
    this.id = opts.id;
    this.formatVersion = opts.formatVersion;
    this.defaultData = opts.defaultData;
    this.cachedData = opts.defaultData;
    this.migrations = opts.migrations;
    if(opts.migrateIds)
      this.migrateIds = Array.isArray(opts.migrateIds) ? opts.migrateIds : [opts.migrateIds];
    this.encodeData = opts.encodeData;
    this.decodeData = opts.decodeData;
    this.engine = typeof opts.storageEngine === "function" ? opts.storageEngine() : opts.storageEngine;
    this.engine.setDataStoreOptions(opts);
  }

  //#region public

  /**
   * Loads the data saved in persistent storage into the in-memory cache and also returns a copy of it.  
   * Automatically populates persistent storage with default data if it doesn't contain any data yet.  
   * Also runs all necessary migration functions if the data format has changed since the last time the data was saved.
   */
  public async loadData(): Promise<TData> {
    try {
      // migrate from UserUtils <=9.x format
      if(firstInit) {
        firstInit = false;
        const dsVer = Number(await this.engine.getValue("__ds_fmt_ver", 0));
        if(isNaN(dsVer) || dsVer < 1) {
          const oldData = await this.engine.getValue(`_uucfg-${this.id}`, null);

          if(oldData) {
            const oldVer = Number(await this.engine.getValue(`_uucfgver-${this.id}`, NaN));
            const oldEnc = await this.engine.getValue(`_uucfgenc-${this.id}`, null);

            const promises: Promise<void>[] = [];

            const migrateFmt = (oldKey: string, newKey: string, value: SerializableVal): void => {
              promises.push(this.engine.setValue(newKey, value));
              promises.push(this.engine.deleteValue(oldKey));
            };

            oldData &&
              migrateFmt(`_uucfg-${this.id}`, `_ds_dat-${this.id}`, oldData);
            !isNaN(oldVer) &&
              migrateFmt(`_uucfgver-${this.id}`, `_ds_ver-${this.id}`, oldVer);
            typeof oldEnc === "boolean" &&
              migrateFmt(`_uucfgenc-${this.id}`, `_ds_enc-${this.id}`, oldEnc);

            await Promise.allSettled(promises);
          }
          await this.engine.setValue("__ds_fmt_ver", dsFmtVer);
        }
      }

      // migrate ids
      if(this.migrateIds.length > 0) {
        await this.migrateId(this.migrateIds);
        this.migrateIds = [];
      }

      // load data
      const gmData = await this.engine.getValue(`_ds_dat-${this.id}`, JSON.stringify(this.defaultData));
      let gmFmtVer = Number(await this.engine.getValue(`_ds_ver-${this.id}`, NaN));

      // save default if no data is found
      if(typeof gmData !== "string") {
        await this.saveDefaultData();
        return { ...this.defaultData };
      }

      // check if the data is encoded
      const isEncoded = Boolean(await this.engine.getValue(`_ds_enc-${this.id}`, false));

      // if no format version is found, save the current one
      let saveData = false;
      if(isNaN(gmFmtVer)) {
        await this.engine.setValue(`_ds_ver-${this.id}`, gmFmtVer = this.formatVersion);
        saveData = true;
      }

      // deserialize the data if needed
      let parsed = await this.engine.deserializeData(gmData, isEncoded);

      // run migrations if needed
      if(gmFmtVer < this.formatVersion && this.migrations)
        parsed = await this.runMigrations(parsed, gmFmtVer); // setting saveData = true not needed since runMigrations() already saves the data

      // save the data if it was changed
      if(saveData)
        await this.setData(parsed);

      // save copy of the data to cache and return it
      return this.cachedData = this.engine.deepCopy(parsed);
    }
    catch(err) {
      console.warn("Error while parsing JSON data, resetting it to the default value.", err);
      await this.saveDefaultData();
      return this.defaultData;
    }
  }

  /**
   * Returns a copy of the data from the in-memory cache.  
   * Use {@linkcode loadData()} to get fresh data from persistent storage (usually not necessary since the cache should always exactly reflect persistent storage).
   */
  public getData(): TData {
    return this.engine.deepCopy(this.cachedData);
  }

  /** Saves the data synchronously to the in-memory cache and asynchronously to the persistent storage */
  public setData(data: TData): Promise<void> {
    this.cachedData = data;
    const useEncoding = this.encodingEnabled();
    return new Promise<void>(async (resolve) => {
      await Promise.allSettled([
        this.engine.setValue(`_ds_dat-${this.id}`, await this.engine.serializeData(data, useEncoding)),
        this.engine.setValue(`_ds_ver-${this.id}`, this.formatVersion),
        this.engine.setValue(`_ds_enc-${this.id}`, useEncoding),
      ]);
      resolve();
    });
  }

  /** Saves the default data passed in the constructor synchronously to the in-memory cache and asynchronously to persistent storage */
  public async saveDefaultData(): Promise<void> {
    this.cachedData = this.defaultData;
    const useEncoding = this.encodingEnabled();
    await Promise.allSettled([
      this.engine.setValue(`_ds_dat-${this.id}`, await this.engine.serializeData(this.defaultData, useEncoding)),
      this.engine.setValue(`_ds_ver-${this.id}`, this.formatVersion),
      this.engine.setValue(`_ds_enc-${this.id}`, useEncoding),
    ]);
  }

  /**
   * Call this method to clear all persistently stored data associated with this DataStore instance.  
   * The in-memory cache will be left untouched, so you may still access the data with {@linkcode getData()}  
   * Calling {@linkcode loadData()} or {@linkcode setData()} after this method was called will recreate persistent storage with the cached or default data.  
   *   
   * - ⚠️ This requires the additional directive `@grant GM.deleteValue` if the storageMethod is left as the default of `"GM"`
   */
  public async deleteData(): Promise<void> {
    await Promise.allSettled([
      this.engine.deleteValue(`_ds_dat-${this.id}`),
      this.engine.deleteValue(`_ds_ver-${this.id}`),
      this.engine.deleteValue(`_ds_enc-${this.id}`),
    ]);
  }

  /** Returns whether encoding and decoding are enabled for this DataStore instance */
  public encodingEnabled(): this is Required<Pick<DataStoreOptions<TData>, "encodeData" | "decodeData">> {
    return Boolean(this.encodeData && this.decodeData);
  }

  //#region migrations

  /**
   * Runs all necessary migration functions consecutively and saves the result to the in-memory cache and persistent storage and also returns it.  
   * This method is automatically called by {@linkcode loadData()} if the data format has changed since the last time the data was saved.  
   * Though calling this method manually is not necessary, it can be useful if you want to run migrations for special occasions like a user importing potentially outdated data that has been previously exported.  
   *   
   * If one of the migrations fails, the data will be reset to the default value if `resetOnError` is set to `true` (default). Otherwise, an error will be thrown and no data will be saved.
   */
  public async runMigrations(oldData: unknown, oldFmtVer: number, resetOnError = true): Promise<TData> {
    if(!this.migrations)
      return oldData as TData;

    let newData = oldData;
    const sortedMigrations = Object.entries(this.migrations)
      .sort(([a], [b]) => Number(a) - Number(b));

    let lastFmtVer = oldFmtVer;

    for(const [fmtVer, migrationFunc] of sortedMigrations) {
      const ver = Number(fmtVer);
      if(oldFmtVer < this.formatVersion && oldFmtVer < ver) {
        try {
          const migRes = migrationFunc(newData);
          newData = migRes instanceof Promise ? await migRes : migRes;
          lastFmtVer = oldFmtVer = ver;
        }
        catch(err) {
          if(!resetOnError)
            throw new MigrationError(`Error while running migration function for format version '${fmtVer}'`, { cause: err });

          await this.saveDefaultData();
          return this.getData();
        }
      }
    }

    await Promise.allSettled([
      this.engine.setValue(`_ds_dat-${this.id}`, await this.engine.serializeData(newData as TData)),
      this.engine.setValue(`_ds_ver-${this.id}`, lastFmtVer),
      this.engine.setValue(`_ds_enc-${this.id}`, this.encodingEnabled()),
    ]);

    return this.cachedData = { ...newData as TData };
  }

  /**
   * Tries to migrate the currently saved persistent data from one or more old IDs to the ID set in the constructor.  
   * If no data exist for the old ID(s), nothing will be done, but some time may still pass trying to fetch the non-existent data.
   */
  public async migrateId(oldIds: string | string[]): Promise<void> {
    const ids = Array.isArray(oldIds) ? oldIds : [oldIds];
    await Promise.all(ids.map(async id => {
      const data = await this.engine.getValue(`_ds_dat-${id}`, JSON.stringify(this.defaultData));
      const fmtVer = Number(await this.engine.getValue(`_ds_ver-${id}`, NaN));
      const isEncoded = Boolean(await this.engine.getValue(`_ds_enc-${id}`, false));

      if(data === undefined || isNaN(fmtVer))
        return;

      const parsed = await this.engine.deserializeData(data, isEncoded);
      await Promise.allSettled([
        this.engine.setValue(`_ds_dat-${this.id}`, await this.engine.serializeData(parsed)),
        this.engine.setValue(`_ds_ver-${this.id}`, fmtVer),
        this.engine.setValue(`_ds_enc-${this.id}`, isEncoded),
        this.engine.deleteValue(`_ds_dat-${id}`),
        this.engine.deleteValue(`_ds_ver-${id}`),
        this.engine.deleteValue(`_ds_enc-${id}`),
      ]);
    }));
  }
}
