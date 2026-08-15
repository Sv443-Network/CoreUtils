/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module DataStoreSerializer
 * This module contains the DataStoreSerializer class, which allows you to import and export serialized DataStore data - [see the documentation for more info](https://github.com/Sv443-Network/UserUtils/blob/main/docs.md#datastoreserializer)
 */

import { computeHash } from "./crypto.ts";
import { ChecksumMismatchError, DatedError, ScriptContextError } from "./Errors.ts";
import type { DataStore, DataStoreData } from "./DataStore.ts";
import { PicoEmitter, type PicoEmitterOptions } from "./PicoEmitter.ts";

/** Options for the DataStoreSerializer class */
export type DataStoreSerializerOptions = {
  /** Whether to add a checksum to the exported data. Defaults to `true` */
  addChecksum?: boolean;
  /** Whether to ensure the integrity of the data when importing it by throwing an error (doesn't throw when the checksum property doesn't exist). Defaults to `true` */
  ensureIntegrity?: boolean;
  /** If provided, all stores with an ID in the value's array will be remapped to the key's ID when deserialization is called. If an entry doesn't match the ID of any of the DataStore instances provided in the constructor, it will be skipped. */
  remapIds?: {
    [toID: string]: string[];
  };
  /**
   * Controls the type of the `data` property on {@linkcode SerializedDataStore} objects.  
   * When this is set to `false`, `data` will be the raw data object instead of a string, regardless of whether {@linkcode DataStoreSerializer.serialize()} or {@linkcode DataStoreSerializer.serializePartial()} are called with their `stringify` / `stringified` parameter set to `true` or `false`.
   */
  stringifyData?: boolean;
  /** Options passed to the underlying {@linkcode PicoEmitter} instance. */
  picoEmitterOptions?: PicoEmitterOptions;
};

/** Meta object and serialized data of a DataStore instance */
export type SerializedDataStore<TData extends string | DataStoreData = string> = {
  /** The ID of the DataStore instance. */
  id: string;
  /** The serialized data. */
  data: TData;
  /** The format version of the data. */
  formatVersion: number;
  /** Whether the data is encoded. */
  encoded: boolean;
  /** The checksum of the data - key is not present when `addChecksum` is `false`. */
  checksum?: string;
};

/** Result of {@linkcode DataStoreSerializer.loadStoresData()} */
export type LoadStoresDataResult = {
  /** The ID of the DataStore instance. */
  id: string;
  /** The in-memory data object. */
  data: object;
}

/** Filter for selecting data stores. Can either be an array of IDs, or a function that takes each ID as the sole argument and returns a boolean filter result. */
export type StoreFilter = string[] | ((id: string) => boolean);

/** Event map for the {@linkcode DataStoreSerializer} */
export type DataStoreSerializerEventMap = {
  /** Emitted once, whenever all contained DataStore instances have finished loading at least once. No arguments. */
  loadedAllStores: () => void;
  /** Emitted once, whenever a contained DataStore instance has finished loading at least once. Gets passed the instance as the only argument. */
  loadedStore: (store: DataStore<any, boolean>) => void;
  /** Emitted whenever one or more stores have had their data reset to the default value. Gets passed an array of all instances that were reset. */
  resetStores: (stores: DataStore<any, boolean>[]) => void;
  /** Emitted whenever one or more stores have had their persistent data cleared. Gets passed an array of all instances that were cleared. */
  deletedStores: (stores: DataStore<any, boolean>[]) => void;
};

/**
 * Allows for easy serialization and deserialization of multiple {@linkcode DataStore} instances.  
 * Offers methods to only serialize or deserialize a subset of the stores, and to ensure the integrity of the data by adding checksums.  
 *   
 * All methods are at least `protected`, so you can easily extend this class and overwrite them to use a different storage method or to add additional functionality.  
 * Remember that you can call `super.methodName()` in the subclass to access the original method.  
 *   
 * - ⚠️ Needs to run in a secure context (HTTPS) due to the use of the SubtleCrypto API if checksumming is enabled.  
 */
export class DataStoreSerializer extends PicoEmitter<DataStoreSerializerEventMap> {
  protected stores: DataStore<any, boolean>[];
  protected options: Required<DataStoreSerializerOptions>;
  /** Set of IDs of loaded stores. Is kept in sync via {@linkcode bindStoreEvents()}. */
  protected loadedStores: Set<string> = new Set<string>();
  /** Unsubscribe functions for the event listeners bound to each contained {@linkcode DataStore} instance, keyed by store ID. */
  protected storeEventUnsubs: Map<string, Array<() => void>> = new Map();

  constructor(stores: DataStore<any, boolean>[], options: DataStoreSerializerOptions = {}) {
    super(options?.picoEmitterOptions);

    if(!crypto || !crypto.subtle)
      throw new ScriptContextError("DataStoreSerializer has to run in a secure context (HTTPS) or in another environment that implements the subtleCrypto API!");

    this.stores = stores;
    this.options = {
      addChecksum: true,
      ensureIntegrity: true,
      remapIds: {},
      stringifyData: true,
      picoEmitterOptions: {},
      ...options,
    };

    for(const store of this.stores)
      this.bindStoreEvents(store);
  }

  /**
   * Subscribes to the relevant events of a single {@linkcode DataStore} instance and forwards them as this instance's own events, so that they're also emitted when a contained store is loaded, reset or deleted directly through its own instance instead of through this serializer.
   */
  protected bindStoreEvents(store: DataStore<any, boolean>): void {
    this.storeEventUnsubs.set(store.id, [
      store.on("loadData", () => {
        this.loadedStores.add(store.id);
        this.emitEvent("loadedStore", store);
        if(this.stores.every(s => this.loadedStores.has(s.id)))
          this.emitEvent("loadedAllStores");
      }),
      store.on("setDefaultData", () => this.emitEvent("resetStores", [store])),
      store.on("deleteData", () => {
        this.loadedStores.delete(store.id);
        this.emitEvent("deletedStores", [store]);
      }),
    ]);
  }

  /** Unsubscribes from the events of all currently bound {@linkcode DataStore} instances. */
  protected unbindStoreEvents(): void {
    for(const unsubs of this.storeEventUnsubs.values())
      for(const unsub of unsubs)
        unsub();
    this.storeEventUnsubs.clear();
  }

  /**
   * Calculates the checksum of a string or {@linkcode DataStoreData} object. By default, this uses {@linkcode computeHash()} with SHA-256, digested as a hex string.  
   * Override this in a subclass if a custom checksum method is needed for some reason.
   */
  protected async calcChecksum(input: string | DataStoreData, algorithm = "SHA-256"): Promise<string> {
    try {
      return computeHash(typeof input === "string" ? input : JSON.stringify(input), algorithm);
    }
    catch(err) {
      throw new Error(`Failed to calculate checksum: ${(err as Error).message}`, { cause: err });
    }
  }

  /**
   * Serializes only a subset of the {@linkcode DataStore}s a string.  
   * @param stores An array of store IDs or functions that take a store ID and return a boolean
   * @param useEncoding Whether to encode the data using each DataStore's `encodeData()` method
   * @param stringified Whether to return the result as a string or as an array of `SerializedDataStore` objects
   */
  public async serializePartial(stores: StoreFilter, useEncoding?: boolean, stringified?: true): Promise<string>;
  /**
   * Serializes only a subset of the {@linkcode DataStore}s into a string.  
   * @param stores An array of store IDs or functions that take a store ID and return a boolean
   * @param useEncoding Whether to encode the data using each DataStore's `encodeData()` method
   * @param stringified Whether to return the result as a string or as an array of `SerializedDataStore` objects
   */
  public async serializePartial(stores: StoreFilter, useEncoding?: boolean, stringified?: false): Promise<SerializedDataStore<string | DataStoreData>[]>;
  /**
   * Serializes only a subset of the {@linkcode DataStore}s into a string.  
   * @param stores An array of store IDs or functions that take a store ID and return a boolean
   * @param useEncoding Whether to encode the data using each DataStore's `encodeData()` method
   * @param stringified Whether to return the result as a string or as an array of `SerializedDataStore` objects
   */
  public async serializePartial(stores: StoreFilter, useEncoding?: boolean, stringified?: boolean): Promise<string | SerializedDataStore<string | DataStoreData>[]>;
  /**
   * Serializes only a subset of the {@linkcode DataStore}s into a string.  
   * @param stores An array of store IDs or functions that take a store ID and return a boolean
   * @param useEncoding Whether to encode the data using each DataStore's `encodeData()` method
   * @param stringified Whether to return the result as a string or as an array of `SerializedDataStore` objects
   */
  public async serializePartial(stores: StoreFilter, useEncoding = true, stringified = true): Promise<string | SerializedDataStore<string | DataStoreData>[]> {
    const serData: SerializedDataStore<string | DataStoreData>[] = [];

    const filteredStores = this.stores.filter(s => typeof stores === "function" ? stores(s.id) : stores.includes(s.id));
    for(const storeInst of filteredStores) {
      const encoded = Boolean(useEncoding && storeInst.encodingEnabled() && storeInst.encodeData?.[1]);
      const rawData = storeInst.memoryCache ? (storeInst as DataStore<{}, true>).getData() : await storeInst.loadData();
      const data: string | DataStoreData = encoded
        ? await storeInst.encodeData![1](JSON.stringify(rawData))
        : this.options.stringifyData
          ? JSON.stringify(rawData)
          : rawData;

      serData.push({
        id: storeInst.id,
        data,
        formatVersion: storeInst.formatVersion,
        encoded,
        checksum: this.options.addChecksum
          ? await this.calcChecksum(data)
          : undefined,
      });
    }

    return stringified ? JSON.stringify(serData) : serData;
  }

  /**
   * Serializes the data stores into a string.  
   * @param useEncoding Whether to encode the data using each {@linkcode DataStore}'s `encodeData()` method
   * @param stringified Whether to return the result as a string or as an array of `SerializedDataStore` objects
   */
  public async serialize(useEncoding?: boolean, stringified?: true): Promise<string>;
  /**
   * Serializes the data stores into a string.  
   * @param useEncoding Whether to encode the data using each {@linkcode DataStore}'s `encodeData()` method
   * @param stringified Whether to return the result as a string or as an array of `SerializedDataStore` objects
   */
  public async serialize(useEncoding?: boolean, stringified?: false): Promise<SerializedDataStore<string | DataStoreData>[]>;
  /**
   * Serializes the data stores into a string.  
   * @param useEncoding Whether to encode the data using each {@linkcode DataStore}'s `encodeData()` method
   * @param stringified Whether to return the result as a string or as an array of `SerializedDataStore` objects
   */
  public async serialize(useEncoding = true, stringified = true): Promise<string | SerializedDataStore<string | DataStoreData>[]> {
    return this.serializePartial(this.stores.map(s => s.id), useEncoding, stringified);
  }

  /**
   * Deserializes the data exported via {@linkcode serialize()} and imports only a subset into the DataStore instances.  
   * Also triggers the migration process if the data format has changed.
   */
  public async deserializePartial(stores: StoreFilter, data: string | SerializedDataStore[]): Promise<void> {
    const deserStores: SerializedDataStore[] = typeof data === "string" ? JSON.parse(data) : data;

    if(!Array.isArray(deserStores) || !deserStores.every(DataStoreSerializer.isSerializedDataStoreObj))
      throw new TypeError("Invalid serialized data format! Expected an array of SerializedDataStore objects.");

    const resolveStoreId = (id: string): string => (
      Object.entries(this.options.remapIds)
        .find(([, v]) => v.includes(id))
    )?.[0] ?? id;

    for(const storeData of deserStores) {
      const curStoreID = resolveStoreId(storeData.id);
      if(!(typeof stores === "function" ? stores(curStoreID) : stores.includes(curStoreID)))
        continue;

      const storeInst = this.stores.find(s => s.id === curStoreID);

      if(!storeInst)
        throw new DatedError(`Can't deserialize data because no DataStore instance with the ID "${curStoreID}" was found! Make sure to provide it in the DataStoreSerializer constructor.`);

      if(this.options.ensureIntegrity && typeof storeData.checksum === "string") {
        const checksum = await this.calcChecksum(storeData.data);
        if(checksum !== storeData.checksum)
          throw new ChecksumMismatchError(`Checksum mismatch for DataStore with ID "${storeData.id}"!\nExpected: ${storeData.checksum}\nHas: ${checksum}`);
      }

      const decodedData = storeData.encoded && storeInst.encodingEnabled()
        ? await storeInst.decodeData[1](typeof storeData.data === "string" ? storeData.data : JSON.stringify(storeData.data))
        : storeData.data;

      if(storeData.formatVersion && !isNaN(Number(storeData.formatVersion)) && Number(storeData.formatVersion) < storeInst.formatVersion)
        await storeInst.runMigrations(typeof decodedData === "string" ? JSON.parse(decodedData) : decodedData, Number(storeData.formatVersion), false);
      else
        await storeInst.setData(typeof decodedData === "string" ? JSON.parse(decodedData) : decodedData);
    }
  }

  /**
   * Deserializes the data exported via {@linkcode serialize()} and imports the data into all matching {@linkcode DataStore} instances.  
   * Also triggers the migration process if the data format has changed.
   */
  public async deserialize(data: string | SerializedDataStore[]): Promise<void> {
    return this.deserializePartial(this.stores.map(s => s.id), data);
  }

  /**
   * Loads the persistent data of the {@linkcode DataStore} instances into the in-memory cache.  
   * Also triggers the migration process if the data format has changed.
   * @param stores An array of store IDs or a function that takes the store IDs and returns a boolean - if omitted, all stores will be loaded
   * @returns Returns a PromiseSettledResult array with the results of each DataStore instance in the format `{ id: string, data: object }`
   */
  public async loadStoresData(stores?: StoreFilter): Promise<PromiseSettledResult<LoadStoresDataResult>[]> {
    return Promise.allSettled(
      this.getStoresFiltered(stores)
        .map(async (store) => ({
          id: store.id,
          data: await store.loadData(),
        })),
    );
  }

  /**
   * Resets the persistent and in-memory data of the {@linkcode DataStore} instances to their default values.
   * @param stores An array of store IDs or a function that takes the store IDs and returns a boolean - if omitted, all stores will be affected
   */
  public async resetStoresData(stores?: StoreFilter): Promise<PromiseSettledResult<void>[]> {
    return Promise.allSettled(
      this.getStoresFiltered(stores).map(store => store.saveDefaultData()),
    );
  }

  /**
   * Deletes the persistent data of the {@linkcode DataStore} instances.
   * Leaves the in-memory data untouched.
   * @param stores An array of store IDs or a function that takes the store IDs and returns a boolean - if omitted, all stores will be affected
   */
  public async deleteStoresData(stores?: StoreFilter): Promise<PromiseSettledResult<void>[]> {
    return Promise.allSettled(
      this.getStoresFiltered(stores).map(store => store.deleteData()),
    );
  }

  /** Returns an array of the {@linkcode DataStore} instances managed by this DataStoreSerializer. */
  public getStores(): DataStore<any, boolean>[] {
    return this.stores;
  }

  /**
   * Overwrites this DataStoreSerializer instance's stores.
   * @param stores Array of new stores for this instance to manage.
   * @param loadData Set to true to call {@linkcode DataStoreSerializer.loadStoresData()} for the overwritten stores before resolving.
   */
  public async setStores(stores: DataStore<any, boolean>[], loadData = false): Promise<void> {
    this.unbindStoreEvents();
    this.stores = stores;
    this.loadedStores = new Set<string>();
    for(const store of this.stores)
      this.bindStoreEvents(store);
    if(loadData)
      await this.loadStoresData();
  }

  /** Returns the {@linkcode DataStore} instances whose IDs match the provided array or function. */
  protected getStoresFiltered(stores?: StoreFilter): DataStore<any, boolean>[] {
    return this.stores.filter(s => typeof stores === "undefined" ? true : Array.isArray(stores) ? stores.includes(s.id) : stores(s.id));
  }

  /** Checks if a given value is an array of SerializedDataStore objects. */
  public static isSerializedDataStoreObjArray(obj: unknown): obj is SerializedDataStore[] {
    return Array.isArray(obj) && obj.every((o) => typeof o === "object" && o !== null && "id" in o && "data" in o && "formatVersion" in o && "encoded" in o);
  }

  /** Checks if a given value is a SerializedDataStore object. */
  public static isSerializedDataStoreObj(obj: unknown): obj is SerializedDataStore {
    return typeof obj === "object" && obj !== null && "id" in obj && "data" in obj && "formatVersion" in obj && "encoded" in obj;
  }
}
