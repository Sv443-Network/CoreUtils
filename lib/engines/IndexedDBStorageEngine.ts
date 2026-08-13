import { DataStoreEngine, type DataStoreEngineDSOptions } from "../DataStoreEngine.ts";
import { DatedError, ScriptContextError } from "../Errors.ts";
import type { DataStoreData } from "../DataStore.ts";
import type { SerializableVal } from "../types.ts";

/** Options for the {@linkcode IndexedDBStorageEngine} class */
export type IndexedDBStorageEngineOptions = {
  /** Prefix for the DB connection ID. Is set to `__ds-` by default. Set to an empty string to only use the DataStore ID. */
  dbPrefix?: string;
  /** Name of the IndexedDB object store that holds the key-value pairs. Defaults to `keyval` if left undefined. */
  dbStoreName?: string;
  /**
   * Specifies the necessary options for storing data.  
   * - ⚠️ Only specify this if you are using this instance standalone! The parent DataStore will set this automatically.
   */
  dataStoreOptions?: DataStoreEngineDSOptions<DataStoreData>;
};

/**
 * Storage engine for the {@linkcode DataStore} class that uses the [IndexedDB API.](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)  
 * This allows even non-JSON-serializable data to be stored, like a [File](https://developer.mozilla.org/en-US/docs/Web/API/File) or [Blob.](https://developer.mozilla.org/en-US/docs/Web/API/Blob)  
 *   
 * - ⚠️ Requires an environment with access to the [IndexedDB API.](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)  
 * - ⚠️ Don't reuse engine instances, always create a new one for each instance of stored data (or {@linkcode DataStore} instance).
 */
export class IndexedDBStorageEngine<TData extends DataStoreData = DataStoreData> extends DataStoreEngine<TData> {
  protected options: IndexedDBStorageEngineOptions;

  /** Name of the IndexedDB object store that holds the key-value pairs */
  protected readonly storeName: string;

  /** Cached handle to the opened database, populated lazily on the first call to {@linkcode getValue}, {@linkcode setValue} or {@linkcode deleteValue} */
  private db: IDBDatabase | undefined;
  /** Resolves once the database has finished opening, so concurrent calls don't open it more than once */
  private dbOpenPromise: Promise<IDBDatabase> | undefined;

  /**
   * Creates an instance of `IndexedDBStorageEngine`, a {@linkcode DataStore} storage engine that uses the [IndexedDB API.](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)  
   * This allows even non-JSON-serializable data to be stored, like a [File](https://developer.mozilla.org/en-US/docs/Web/API/File) or [Blob.](https://developer.mozilla.org/en-US/docs/Web/API/Blob)  
   *   
   * - ⚠️ Requires an environment with access to the [IndexedDB API.](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)  
   * - ⚠️ Don't reuse engine instances, always create a new one for each instance of stored data (or {@linkcode DataStore} instance).
   */
  constructor(options?: IndexedDBStorageEngineOptions) {
    super(options?.dataStoreOptions);
    this.options = {
      dbStoreName: "keyval",
      dbPrefix: "__ds-",
      ...options,
    };
    this.storeName = this.options.dbStoreName!;
  }

  //#region storage api

  /** Fetches a value from persistent storage. */
  public async getValue<TValue extends SerializableVal = string>(name: string, defaultValue: TValue): Promise<string | TValue> {
    const db = await this.openDb();
    const val = await new Promise<TValue | undefined>((resolve, reject) => {
      const req = db.transaction(this.storeName, "readonly")
        .objectStore(this.storeName)
        .get(name);
      req.addEventListener("success", () => resolve(req.result));
      req.addEventListener("error", () => reject(req.error));
    });

    return typeof val === "undefined"
      ? defaultValue
      : val;
  }

  /** Sets a value in persistent storage. */
  public async setValue(name: string, value: SerializableVal): Promise<void> {
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).put(value, name);
      tx.addEventListener("complete", () => resolve());
      tx.addEventListener("error", () => reject(tx.error));
      tx.addEventListener("abort", () => reject(tx.error));
    });
  }

  /** Deletes a value from persistent storage. */
  public async deleteValue(name: string): Promise<void> {
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).delete(name);
      tx.addEventListener("complete", () => resolve());
      tx.addEventListener("error", () => reject(tx.error));
      tx.addEventListener("abort", () => reject(tx.error));
    });
  }

  //#region indexeddb

  /** Lazily opens the {@linkcode IDBDatabase} for this DataStore's ID, or returns the cached instance from a previous call. */
  protected openDb(): Promise<IDBDatabase> {
    this.ensureDataStoreOptions();

    if(this.db)
      return Promise.resolve(this.db);
    if(this.dbOpenPromise)
      return this.dbOpenPromise;

    if(typeof indexedDB === "undefined")
      throw new ScriptContextError("IndexedDBStorageEngine requires a DOM environment with access to the IndexedDB API", { cause: new DatedError("'indexedDB' is not available in the global scope") });

    return this.dbOpenPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(`${this.options.dbPrefix}${this.dataStoreOptions.id}`);

      req.addEventListener("upgradeneeded", () => {
        req.result.createObjectStore(this.storeName);
      });
      req.addEventListener("success", () => {
        this.db = req.result;
        resolve(req.result);
      });
      req.addEventListener("error", () => reject(req.error));
    });
  }
}
