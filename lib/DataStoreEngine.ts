/**
 * @module DataStoreEngine
 * This module contains the `DataStoreEngine` class and some of its subclasses like `FileStorageEngine` and `BrowserStorageEngine`.  
 * [See the documentation for more info.](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-datastoreengine)
 */

import type { DataStoreData, DataStoreOptions } from "./DataStore.js";
import { DatedError } from "./Errors.js";
import type { Prettify, SerializableVal } from "./types.js";

//#region >> DataStoreEngine

export type DataStoreEngineDSOptions<TData extends DataStoreData> = Prettify<Pick<DataStoreOptions<TData>, "decodeData" | "encodeData" | "id">>;

export interface DataStoreEngine<TData extends DataStoreData> { // eslint-disable-line @typescript-eslint/no-unused-vars
  /** Deletes all data in persistent storage, including the data container itself (e.g. a file or a database) */
  deleteStorage?(): Promise<void>;
}

/**
 * Base class for creating {@linkcode DataStore} storage engines.  
 * This acts as an interchangeable API for writing and reading persistent data in various environments.
 */
export abstract class DataStoreEngine<TData extends DataStoreData> {
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

  /** Fetches a value from persistent storage */
  public abstract getValue<TValue extends SerializableVal = string>(name: string, defaultValue: TValue): Promise<string | TValue>;
  /** Sets a value in persistent storage */
  public abstract setValue(name: string, value: SerializableVal): Promise<void>;
  /** Deletes a value from persistent storage */
  public abstract deleteValue(name: string): Promise<void>;

  //#region serialization api

  /** Serializes the given object to a string, optionally encoded with `options.encodeData` if {@linkcode useEncoding} is set to true */
  public async serializeData(data: TData, useEncoding?: boolean): Promise<string> {
    this.validateDataStoreOptions();

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
    this.validateDataStoreOptions();

    let decRes = this.dataStoreOptions?.decodeData && useEncoding ? this.dataStoreOptions.decodeData?.[1]?.(data) : undefined;
    if(decRes instanceof Promise)
      decRes = await decRes;

    return JSON.parse(decRes ?? data) as TData;
  }

  //#region misc api

  /** Throws an error if the DataStoreOptions are not set or invalid */
  protected validateDataStoreOptions(): void {
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



//#region >> BrowserStorageEngine

/** Options for the {@linkcode BrowserStorageEngine} class */
export type BrowserStorageEngineOptions = {
  /** Whether to store the data in LocalStorage (default) or SessionStorage */
  type?: "localStorage" | "sessionStorage";
  /**
   * Specifies the necessary options for storing data.  
   * - ⚠️ Only call this if you are using this instance standalone! The parent DataStore will set this automatically.
   */
  dataStoreOptions?: DataStoreEngineDSOptions<DataStoreData>;
};

/**
 * Storage engine for the {@linkcode DataStore} class that uses the browser's LocalStorage or SessionStorage to store data.  
 *   
 * - ⚠️ Requires a DOM environment
 * - ⚠️ Don't reuse engines across multiple {@linkcode DataStore} instances
 */
export class BrowserStorageEngine<TData extends DataStoreData> extends DataStoreEngine<TData> {
  protected options: BrowserStorageEngineOptions & Required<Pick<BrowserStorageEngineOptions, "type">>;

  /**
   * Creates an instance of `BrowserStorageEngine`.  
   *   
   * - ⚠️ Requires a DOM environment  
   * - ⚠️ Don't reuse engines across multiple {@linkcode DataStore} instances
   */
  constructor(options?: BrowserStorageEngineOptions) {
    super(options?.dataStoreOptions);
    this.options = {
      type: "localStorage",
      ...options,
    };
  }

  //#region storage api

  /** Fetches a value from persistent storage */
  public async getValue<TValue extends SerializableVal = string>(name: string, defaultValue: TValue): Promise<string | TValue> {
    return (
      this.options.type === "localStorage"
        ? globalThis.localStorage.getItem(name) as TValue
        : globalThis.sessionStorage.getItem(name) as string
    ) ?? defaultValue;
  }

  /** Sets a value in persistent storage */
  public async setValue(name: string, value: SerializableVal): Promise<void> {
    if(this.options.type === "localStorage")
      globalThis.localStorage.setItem(name, String(value));
    else
      globalThis.sessionStorage.setItem(name, String(value));
  }

  /** Deletes a value from persistent storage */
  public async deleteValue(name: string): Promise<void> {
    if(this.options.type === "localStorage")
      globalThis.localStorage.removeItem(name);
    else
      globalThis.sessionStorage.removeItem(name);
  }
}



//#region >> FileStorageEngine

/** `node:fs/promises` import */
let fs: typeof import("node:fs/promises") | undefined;

/** Options for the {@linkcode FileStorageEngine} class */
export type FileStorageEngineOptions = {
  /** Function that returns a string or a plain string that is the data file path, including name and extension. Defaults to `.ds-${dataStoreID}` */
  filePath?: ((dataStoreID: string) => string) | string;
  /**
   * Specifies the necessary options for storing data.  
   * - ⚠️ Only call this if you are using this instance standalone! The parent DataStore will set this automatically.
   */
  dataStoreOptions?: DataStoreEngineDSOptions<DataStoreData>;
};

/**
 * Storage engine for the {@linkcode DataStore} class that uses a JSON file to store data.  
 *   
 * - ⚠️ Requires Node.js or Deno with Node compatibility (v1.31+)  
 * - ⚠️ Don't reuse engines across multiple {@linkcode DataStore} instances
 */
export class FileStorageEngine<TData extends DataStoreData> extends DataStoreEngine<TData> {
  protected options: FileStorageEngineOptions & Required<Pick<FileStorageEngineOptions, "filePath">>;

  /**
   * Creates an instance of `FileStorageEngine`.  
   *   
   * - ⚠️ Requires Node.js or Deno with Node compatibility (v1.31+)  
   * - ⚠️ Don't reuse engines across multiple {@linkcode DataStore} instances
   */
  constructor(options?: FileStorageEngineOptions) {
    super(options?.dataStoreOptions);
    this.options = {
      filePath: (id) => `.ds-${id}`,
      ...options,
    };
  }

  //#region json file

  /** Reads the file contents */
  protected async readFile(): Promise<TData | undefined> {
    this.validateDataStoreOptions();

    try {
      if(!fs)
        fs = (await import("node:fs/promises"))?.default;
      if(!fs)
        throw new DatedError("FileStorageEngine requires Node.js or Deno with Node compatibility (v1.31+)", { cause: new Error("'node:fs/promises' module not available") });

      const path = typeof this.options.filePath === "string"
        ? this.options.filePath
        : this.options.filePath(this.dataStoreOptions.id);
      const data = await fs.readFile(path, "utf-8");

      return data
        ? JSON.parse(await this.dataStoreOptions?.decodeData?.[1]?.(data) ?? data) as TData
        : undefined;
    }
    catch {
      return undefined;
    }
  }

  /** Overwrites the file contents */
  protected async writeFile(data: TData): Promise<void> {
    this.validateDataStoreOptions();

    try {
      if(!fs)
        fs = (await import("node:fs/promises"))?.default;
      if(!fs)
        throw new DatedError("FileStorageEngine requires Node.js or Deno with Node compatibility (v1.31+)", { cause: new Error("'node:fs/promises' module not available") });

      const path = typeof this.options.filePath === "string"
        ? this.options.filePath
        : this.options.filePath(this.dataStoreOptions.id);

      await fs.mkdir(path.slice(0, path.lastIndexOf("/")), { recursive: true });
      await fs.writeFile(path, await this.dataStoreOptions?.encodeData?.[1]?.(JSON.stringify(data)) ?? JSON.stringify(data, undefined, 2), "utf-8");
    }
    catch(err) {
      console.error("Error writing file:", err);
    }
  }

  //#region storage api

  /** Fetches a value from persistent storage */
  public async getValue<TValue extends SerializableVal = string>(name: string, defaultValue: TValue): Promise<string | TValue> {
    const data = await this.readFile();
    if(!data)
      return defaultValue;
    const value = data?.[name as keyof TData];
    if(value === undefined)
      return defaultValue;
    if(typeof value === "string")
      return value;
    return String(value ?? defaultValue);
  }

  /** Sets a value in persistent storage */
  public async setValue<TValue extends SerializableVal = string>(name: string, value: TValue): Promise<void> {
    let data = await this.readFile() as TData | undefined;
    if(!data)
      data = {} as TData;
    data[name as keyof TData] = value as unknown as TData[keyof TData];
    await this.writeFile(data);
  }

  /** Deletes a value from persistent storage */
  public async deleteValue(name: string): Promise<void> {
    const data = await this.readFile();
    if(!data)
      return;
    delete data[name as keyof TData];
    await this.writeFile(data);
  }

  /** Deletes the file that contains the data of this DataStore. */
  public async deleteStorage(): Promise<void> {
    this.validateDataStoreOptions();

    try {
      if(!fs)
        fs = (await import("node:fs/promises"))?.default;
      if(!fs)
        throw new DatedError("FileStorageEngine requires Node.js or Deno with Node compatibility (v1.31+)", { cause: new Error("'node:fs/promises' module not available") });

      const path = typeof this.options.filePath === "string"
        ? this.options.filePath
        : this.options.filePath(this.dataStoreOptions.id);
      await fs.unlink(path);
    }
    catch(err) {
      console.error("Error deleting file:", err);
    }
  }
}
