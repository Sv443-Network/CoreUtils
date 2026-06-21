/**
 * @module DataStoreEngine
 * This module contains the `DataStoreEngine` class and some of its subclasses like `FileStorageEngine` and `BrowserStorageEngine`.  
 * [See the documentation for more info.](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-datastoreengine)
 */

import type { DataStoreData, DataStoreOptions } from "./DataStore.ts";
import { DatedError } from "./Errors.ts";
import type { Prettify, SerializableVal } from "./types.ts";

//#region >> DataStoreEngine

/** Contains the only properties of {@linkcode DataStoreOptions} that are relevant to the {@linkcode DataStoreEngine} class. */
export type DataStoreEngineDSOptions<TData extends DataStoreData = DataStoreData> = Prettify<Pick<DataStoreOptions<TData, boolean>, "decodeData" | "encodeData" | "id">>;

export interface DataStoreEngine<TData extends DataStoreData = DataStoreData> { // eslint-disable-line @typescript-eslint/no-unused-vars
  /** Deletes all data in persistent storage, including the data container itself (e.g. a file or a database) */
  deleteStorage?(): Promise<void>;
}

/**
 * Base class for creating {@linkcode DataStore} storage engines.  
 * This acts as an interchangeable API for writing and reading persistent JSON-serializable data in various environments.
 */
export abstract class DataStoreEngine<TData extends DataStoreData = DataStoreData> {
  protected dataStoreOptions!: DataStoreEngineDSOptions<TData>; // setDataStoreOptions() is called from inside the DataStore constructor to set this value

  constructor(options?: DataStoreEngineDSOptions<TData>) {
    if(options)
      this.dataStoreOptions = options;
  }

  /** Called by DataStore on creation, to pass its options. Only call this if you are using this instance standalone! */
  public setDataStoreOptions(dataStoreOptions: DataStoreEngineDSOptions<TData>): void {
    this.dataStoreOptions = dataStoreOptions;
  }

  //#region storage api

  /** Fetches a value from persistent storage. Defaults to `defaultValue` if the value does not exist. `null` is considered a valid value. */
  public abstract getValue<TValue extends SerializableVal = string>(name: string, defaultValue: TValue): Promise<string | TValue>;

  /** Sets a value in persistent storage */
  public abstract setValue(name: string, value: SerializableVal): Promise<void>;

  /** Deletes a value from persistent storage */
  public abstract deleteValue(name: string): Promise<void>;

  //#region serialization api

  /** Serializes the given object to a string, optionally encoded with `options.encodeData` if {@linkcode useEncoding} is not set to false and the `encodeData` and `decodeData` options are set */
  public async serializeData(data: TData, useEncoding?: boolean): Promise<string> {
    this.ensureDataStoreOptions();

    const stringData = JSON.stringify(data);
    if(!useEncoding || !this.dataStoreOptions?.encodeData || !this.dataStoreOptions?.decodeData)
      return stringData;

    const encRes = this.dataStoreOptions?.encodeData?.[1]?.(stringData);
    if(encRes instanceof Promise)
      return await encRes;
    return encRes;
  }

  /** Deserializes the given string to a JSON object, optionally decoded with `options.decodeData` if {@linkcode useEncoding} is set to true */
  public async deserializeData(data: string, useEncoding?: boolean): Promise<TData> {
    this.ensureDataStoreOptions();

    let decRes = this.dataStoreOptions?.decodeData && useEncoding ? this.dataStoreOptions.decodeData?.[1]?.(data) : undefined;
    if(decRes instanceof Promise)
      decRes = await decRes;

    return JSON.parse(decRes ?? data) as TData;
  }

  //#region misc api

  /** Throws an error if the {@linkcode DataStoreOptions} are not set or invalid. Call in every method where {@linkcode DataStoreEngineDSOptions} needs to be present. */
  protected ensureDataStoreOptions(): void {
    if(!this.dataStoreOptions)
      throw new DatedError("DataStoreEngine must be initialized with DataStore options before use. If you are using this instance standalone, set them in the constructor or call `setDataStoreOptions()` with the DataStore options.");
    if(!this.dataStoreOptions.id)
      throw new DatedError("DataStoreEngine must be initialized with a valid DataStore ID");
  }

  /**
   * Copies a JSON-compatible object and loses all its internal references in the process.  
   * Uses [`structuredClone()`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) if available, otherwise falls back to `JSON.parse(JSON.stringify(obj))`.
   */
  public deepCopy<T>(obj: T): T {
    try {
      if("structuredClone" in globalThis)
        return structuredClone(obj) as T;
    }
    catch { void 0; }
    return JSON.parse(JSON.stringify(obj));
  }
}
