import { DataStoreEngine, type DataStoreEngineDSOptions } from "../DataStoreEngine.ts";
import { DatedError, ScriptContextError } from "../Errors.ts";
import type { DataStoreData } from "../DataStore.ts";
import type { SerializableVal } from "../types.ts";

/** `node:fs/promises` import */
let fs: typeof import("node:fs/promises") | undefined;

/** Options for the {@linkcode FileStorageEngine} class */
export type FileStorageEngineOptions = {
  /** Function that returns a string or a plain string that is the data file path, including name and extension. Defaults to `.ds-${dataStoreID}` */
  filePath?: ((dataStoreID: string, dataStoreOptions: DataStoreEngineDSOptions<DataStoreData>) => string) | string;
  /**
   * Specifies the necessary options for storing data.  
   * - ⚠️ Only specify this if you are using this instance standalone! The parent DataStore will set this automatically.
   */
  dataStoreOptions?: DataStoreEngineDSOptions<DataStoreData>;
};

/**
 * Storage engine for the {@linkcode DataStore} class that uses a JSON file to store JSON-serializable data.  
 *   
 * - ⚠️ Requires Node.js or Deno with Node compatibility (v1.31+)  
 * - ⚠️ Don't reuse engine instances, always create a new one for each {@linkcode DataStore} instance
 */
export class FileStorageEngine<TData extends DataStoreData = DataStoreData> extends DataStoreEngine<TData> {
  protected options: FileStorageEngineOptions & Required<Pick<FileStorageEngineOptions, "filePath">>;
  private fileAccessQueue: Promise<void> = Promise.resolve();

  /**
   * Creates an instance of `FileStorageEngine`.  
   *   
   * - ⚠️ Requires Node.js or Deno with Node compatibility (v1.31+)  
   * - ⚠️ Don't reuse engine instances, always create a new one for each {@linkcode DataStore} instance
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
    this.ensureDataStoreOptions();

    try {
      if(!fs)
        fs = (await import("node:fs/promises"))?.default;
      if(!fs)
        throw new ScriptContextError("FileStorageEngine requires Node.js or Deno with Node compatibility (v1.31+)", { cause: new DatedError("'node:fs/promises' module not available") });

      const path = typeof this.options.filePath === "string"
        ? this.options.filePath
        : this.options.filePath(this.dataStoreOptions.id, this.dataStoreOptions);
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
    this.ensureDataStoreOptions();

    try {
      if(!fs)
        fs = (await import("node:fs/promises"))?.default;
      if(!fs)
        throw new ScriptContextError("FileStorageEngine requires Node.js or Deno with Node compatibility (v1.31+)", { cause: new DatedError("'node:fs/promises' module not available") });

      const path = typeof this.options.filePath === "string"
        ? this.options.filePath
        : this.options.filePath(this.dataStoreOptions.id, this.dataStoreOptions);

      await fs.mkdir(path.slice(0, path.lastIndexOf(path.includes("/") ? "/" : "\\")), { recursive: true });
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
    if(typeof value === "undefined")
      return defaultValue;

    if(typeof defaultValue === "string") {
      // backward compat: callers expecting strings should get JSON strings for stored objects/arrays
      if(typeof value === "object" && value !== null)
        return JSON.stringify(value);
      if(typeof value === "string")
        return value;
      return String(value);
    }

    if(typeof value === "string") {
      // legacy compat: try to revive JSON-encoded values when caller expects non-strings
      try {
        const parsed = JSON.parse(value);
        return parsed as TValue;
      }
      catch {
        return defaultValue;
      }
    }

    return value as unknown as TValue;
  }

  /** Sets a value in persistent storage */
  public async setValue<TValue extends SerializableVal = string>(name: string, value: TValue): Promise<void> {
    // serialize file access to prevent race conditions
    this.fileAccessQueue = this.fileAccessQueue.then(async () => {
      let data = await this.readFile() as TData | undefined;
      if(!data)
        data = {} as TData;
      // store JSON-parseable objects/arrays directly for human-readable files
      let storeVal: unknown = value;
      if(typeof value === "string") {
        try {
          if(value.startsWith("{") || value.startsWith("[")) {
            const parsed = JSON.parse(value);
            if(typeof parsed === "object" && parsed !== null)
              storeVal = parsed;
          }
        }
        catch { void 0; }
      }
      data[name as keyof TData] = storeVal as TData[keyof TData];
      await this.writeFile(data);
    }).catch((err) => {
      console.error("Error in setValue:", err);
      throw err;
    });
    await this.fileAccessQueue.catch(() => {});
  }

  /** Deletes a value from persistent storage */
  public async deleteValue(name: string): Promise<void> {
    // serialize file access to prevent race conditions
    this.fileAccessQueue = this.fileAccessQueue.then(async () => {
      const data = await this.readFile();
      if(!data)
        return;
      delete data[name as keyof TData];
      await this.writeFile(data);
    }).catch((err) => {
      console.error("Error in deleteValue:", err);
      throw err;
    });
    await this.fileAccessQueue.catch(() => {});
  }

  /** Deletes the file that contains the data of this DataStore. */
  public async deleteStorage(): Promise<void> {
    this.ensureDataStoreOptions();

    try {
      if(!fs)
        fs = (await import("node:fs/promises"))?.default;
      if(!fs)
        throw new ScriptContextError("FileStorageEngine requires Node.js or Deno with Node compatibility (v1.31+)", { cause: new DatedError("'node:fs/promises' module not available") });

      const path = typeof this.options.filePath === "string"
        ? this.options.filePath
        : this.options.filePath(this.dataStoreOptions.id, this.dataStoreOptions);

      return await fs.unlink(path);
    }
    catch(err) {
      console.error("Error deleting file:", err);
    }
  }
}
