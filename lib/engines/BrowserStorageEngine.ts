import { DataStoreEngine, type DataStoreEngineDSOptions } from "../DataStoreEngine.ts";
import type { DataStoreData } from "../DataStore.ts";
import type { SerializableVal } from "../types.ts";

/** Options for the {@linkcode BrowserStorageEngine} class */
export type BrowserStorageEngineOptions = {
  /** Whether to store the data in LocalStorage (default) or SessionStorage */
  type?: "localStorage" | "sessionStorage";
  /**
   * Specifies the necessary options for storing data.  
   * - ⚠️ Only specify this if you are using this instance standalone! The parent DataStore will set this automatically.
   */
  dataStoreOptions?: DataStoreEngineDSOptions<DataStoreData>;
};

/**
 * Storage engine for the {@linkcode DataStore} class that uses the browser's LocalStorage or SessionStorage to store JSON-serializable data.  
 *   
 * - ⚠️ Requires a DOM environment
 * - ⚠️ Don't reuse engine instances, always create a new one for each {@linkcode DataStore} instance
 */
export class BrowserStorageEngine<TData extends DataStoreData = DataStoreData> extends DataStoreEngine<TData> {
  protected options: BrowserStorageEngineOptions & Required<Pick<BrowserStorageEngineOptions, "type">>;

  /**
   * Creates an instance of `BrowserStorageEngine`.  
   *   
   * - ⚠️ Requires a DOM environment  
   * - ⚠️ Don't reuse engine instances, always create a new one for each {@linkcode DataStore} instance
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
    const val = (
      this.options.type === "localStorage"
        ? globalThis.localStorage.getItem(name) as TValue
        : globalThis.sessionStorage.getItem(name) as string
    );
    return typeof val === "undefined" ? defaultValue : val;
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
