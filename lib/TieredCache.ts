/**
 * @module TieredCache
 * This module contains the TieredCache class, which is a cache that can have multiple tiers with different max TTLs, with data being moved between tiers based on what is fetched the most.
 */

import { compress, decompress } from "./crypto.js";
import { DataStore, DataStoreOptions, type DataStoreData } from "./DataStore.js";
import { ValidationError } from "./Errors.js";
import { NanoEmitter, type NanoEmitterOptions } from "./NanoEmitter.js";
import { autoPlural } from "./text.js";
import type { DataStoreEngine } from "./DataStoreEngine.js";
import type { Prettify } from "./types.js";

//#region types

/** Options for the {@linkcode TieredCache} class. */
export type TieredCacheOptions<TData extends DataStoreData> = Prettify<{
  /** Unique identifier for this cache. */
  id: string;
  /** The available cache tiers. */
  tiers: TieredCacheTierOptions<TData>[];
  /** Optional options to pass to the {@linkcode NanoEmitter} constructor. */
  nanoEmitterOptions?: NanoEmitterOptions;
}>;

/** Options object as resolved by the {@linkcode TieredCache.resolveTierOpts()} method. */
type TieredCacheResolvedTierOpts<TData extends DataStoreData> = Prettify<
  & TieredCacheTierOptions<TData>
  & Pick<Required<TieredCacheTierOptions<TData>>, "compressionFormat">
>;

/** Options for when a {@linkcode TieredCache} entry goes stale. */
export type TieredCacheStaleOptions = Prettify<{
  /** The method to use for determining which entries are stale. `recency` = least recently used, `frequency` = least frequently used, `relevance` = combination of both (default). */
  method?: "relevance" | "recency" | "frequency";
  /** Maximum time to live for the data in this tier in seconds. */
  ttl?: number;
  /** Maximum amount of entries to keep in this tier. */
  amount?: number;
  /** The index of the cache tier to send the entry to when it goes stale. Defaults to the next available tier, or deletes the entry if there is none. */
  sendToTier?: number;
}>;

/** Options for entry propagation between {@linkcode TieredCache} tiers. */
export type TieredCachePropagateTierOptions = Prettify<{
  /** The index of the cache tier to propagate the entry to. Use negative numbers for accessing from the end, just like `Array.prototype.at()`. Use `1` for the second tier, use `-1` for the last. */
  index: number;
  /** Whether to propagate created entries to the cache with this index. Defaults to true. */
  created?: boolean;
  /** Whether to propagate updated entries to the cache with this index. Defaults to true. */
  updated?: boolean;
  /** Whether to propagate deleted entries to the cache with this index. Defaults to true. */
  deleted?: boolean;
  /** Whether to propagate accessed entries to the cache with this index. Defaults to true. */
  accessed?: boolean;
}>;

/** Options for each {@linkcode TieredCache} tier. */
export type TieredCacheTierOptions<TData extends DataStoreData> = Prettify<{
  /**
   * Engine used for persistent storage. Can be a function that returns a DataStoreEngine or a DataStoreEngine instance.  
   * If this property is not set, this tier will not persist data and only keeps it in memory.  
   * - ⚠️ **Don't reuse instances in multiple tiers and make sure the ID is always unique!**
   */
  engine?: (() => DataStoreEngine<TData>) | DataStoreEngine<TData>;
  /** Which compression format to use for this tier's persistent storage. Defaults to `deflate-raw` - set to `null` to disable compression. */
  compressionFormat?: CompressionFormat | null;
  /** Options for when an entry goes stale, making it move to a lower tier or get fully deleted. */
  staleOptions?: TieredCacheStaleOptions;
  /** To which tiers to propagate created and updated entries. Defaults to the next tier and all properties set to their default. */
  propagateTiers?: TieredCachePropagateTierOptions[];
}>;

/** Events that can be emitted by the {@linkcode TieredCache} class. */
export type TieredCacheEventMap = {};

//#region class TieredCache

/**
 * Cache class that can have multiple tiers with different max TTLs, with data being moved between tiers based on what is fetched the most.  
 * Persists data using DataStore and DataStoreEngines.  
 * The zeroth tier contains the most accessed data, and the last tier contains the least accessed data, so it is recommended to use slower storage engines for the last tier(s).
 */
export class TieredCache<TData extends DataStoreData> extends NanoEmitter<TieredCacheEventMap> {
  protected options: TieredCacheOptions<TData>;
  protected stores = new Map<number, DataStore<TData>>();

  /**
   * Creates a new TieredCache instance.  
   * It is a cache that can have multiple tiers with different max TTLs, with data being moved between tiers based on what is fetched the most.  
   * It persists data using DataStore and DataStoreEngines.  
   * The zeroth tier contains the most accessed data, and the last tier contains the least accessed data, so it is recommended to use slower storage engines for the last tier(s).  
   * If the given {@linkcode options} are invalid, a {@linkcode ValidationError} is thrown.
   */
  constructor(options: TieredCacheOptions<TData>) {
    super(options.nanoEmitterOptions);

    this.validateOptions(options);
    this.options = options;

    // initialize stores:
    for(let i = 0; i < this.options.tiers.length; i++) {
      const tierOpts = this.resolveTierOpts(i);
      if(!tierOpts)
        continue;
      const store = new DataStore<TData>({
        id: `__tc-${this.options.id}-${i}`,
        // TODO:
        formatVersion: 1,
        defaultData: {},
        engine: typeof tierOpts.engine === "function" ? tierOpts.engine() : tierOpts.engine,
        ...(typeof tierOpts.compressionFormat === "string" ? {
          encodeData: (data: string) => compress(data, tierOpts.compressionFormat!, "string"),
          decodeData: (data: string) => decompress(data, tierOpts.compressionFormat!, "string"),
        } : {}),
      } as DataStoreOptions<TData>);
      this.stores.set(i, store);
    }
  }

  //#region validation

  /** Validates the options for this cache and throws an Error containing all problems if they're invalid. Should be called once in the constructor. */
  protected validateOptions(opts: TieredCacheOptions<TData>): void {
    const errors: string[] = [];

    if(!opts.id || typeof opts.id !== "string")
      errors.push("'id' must be a non-empty string");
    if(!opts.tiers || !Array.isArray(opts.tiers) || opts.tiers.length === 0 || opts.tiers.some(tier => !tier || typeof tier !== "object"))
      errors.push("'tiers' must be a non-empty array of objects");
    else {
      for(let i = 0; i < opts.tiers.length; i++) {
        const tierOpts = opts.tiers[i];
        if(!tierOpts)
          continue;

        if("staleOptions" in tierOpts) {
          const staleOpts = tierOpts.staleOptions!;

          if("sendToTier" in staleOpts && staleOpts.sendToTier !== undefined) {
            if(!Number.isInteger(staleOpts.sendToTier) || typeof staleOpts.sendToTier !== "number" || staleOpts.sendToTier < 0 || staleOpts.sendToTier >= opts.tiers.length)
              errors.push(`'tier[${i}].staleOptions.sendToTier' must be an integer index between 0 and ${opts.tiers.length - 1}`);
          }
        }

        if("propagateTiers" in tierOpts && Array.isArray(tierOpts.propagateTiers)) {
          for(let j = 0; j < tierOpts.propagateTiers.length; j++) {
            const propagateTier = tierOpts.propagateTiers[j];
            if(!propagateTier || typeof propagateTier.index !== "number" || !Number.isInteger(propagateTier.index) || propagateTier.index < 0 || propagateTier.index >= opts.tiers.length)
              errors.push(`'tier[${i}].propagateTiers[${j}].index' must be an integer index between 0 and ${opts.tiers.length - 1}`);
          }
        }
      }
    }

    if(errors.length > 0) {
      const errStr = errors.length > 1
        ? errors.reduce((a, c, i) => `${a}${i > 0 ? "\n" : ""}- ${c}`, "")
        : errors[0];
      throw new ValidationError(`TieredCache options validation ${autoPlural("error", errors)}:\n${errStr}`);
    }
  }

  //#region accessors

  public async get(matching: string | ((tier: TieredCacheTierOptions<TData>) => boolean)): Promise<TData | undefined> {
    // TODO:
    void matching;
    return undefined;
  }

  public async upsert(matching: string | ((tier: TieredCacheTierOptions<TData>) => boolean), data: TData): Promise<boolean> {
    // TODO:
    void matching;
    void data;
    return false;
  }

  //#region load data

  /** Loads all persistent data from all tiers and initializes the DataStore instances. */
  public async loadData(): Promise<PromiseSettledResult<TData>[]> {
    const loadPromises: Promise<TData>[] = [];
    for(let i = 0; i < this.options.tiers.length; i++) {
      const tierOpts = this.resolveTierOpts(i);
      const store = this.stores.get(i);
      if(!tierOpts || !store)
        continue;

      loadPromises.push(store.loadData());
    }
    return await Promise.allSettled(loadPromises);
  }

  //#region protected

  /** Returns the options for the specified tier, after filling in all defaults. */
  protected resolveTierOpts(index: number): Prettify<TieredCacheResolvedTierOpts<TData>> | undefined {
    if(index < 0 || index >= this.options.tiers.length)
      return undefined;

    const tierOpts = this.options.tiers[index];
    if(!tierOpts)
      return undefined;

    return {
      compressionFormat: "deflate-raw",
      ...tierOpts,
    } satisfies ReturnType<typeof this.resolveTierOpts>;
  }
}


// example instantiation:
/*
const lyricsUrlCache = new TieredCache({
  id: "lyricsUrl",
  tiers: [
    // L0: memory & browser storage
    // loaded from localStorage into memory on startup, loaded from memory cache on each cache request, until staleness causes a re-fetch from L1
    // persisted to memory and localStorage on each cache update
    {
      persistStore: {
        // (id: "__tc-lyricsUrl-0")
        formatVersion: 1,
        migrations: {},
        engine: new BrowserStorageEngine({
          type: "localStorage",
        }),
      },
      memCache: true,
      staleOptions: {
        // if any of these are true, the oldest entry is moved to the lower tier
        ttl: 60 * 60 * 24, // 1 day
        amount: 100,
        // specify a custom tier to send the entry to
        sendToTier: 1,
      },
      // to which tier index each cache update should also be propagated
      propagateTiers: [1],
    },
    // L1: JSON file storage
    // loaded from JSON file via Node/Deno on each cache request
    // persisted to JSON file via Node/Deno on each cache update
    {
      // (id = "__tc-lyricsUrl-1")
      memCache: false,
      engine: () => new FileStorageEngine({
        filePath: (id) => `./.cache/tc-${id}.json`,
      }),
      staleOptions: {
        // since there's no tier below, the oldest entry will be deleted
        ttl: 60 * 60 * 24 * 90, // 90 days
        amount: 25_000,
      },
      // compress before storing and decompress after loading
      encodeData: (data) => compress(data, "deflate", "string"),
      decodeData: (data) => decompress(data, "deflate", "string"),
    }
  ],
  async fetchAction(artists: string, title: string) {
    const res = await fetch(
      `https://api.sv443.net/geniurl/search/top?q=${encodeURIComponent(artists)}-${encodeURIComponent(title)}`,
      {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
      }
    );
    if(res.status >= 300 || res.status < 200)
      throw new Error(`Failed to fetch lyrics URL: ${res.statusText}`);

    const data = await res.json();

    if(data && "error" in data && !data.error && "url" in data && typeof data.url === "string")
      return {
        key: [artists, title],
        data: data.url,
        maxTTL: 60 * 60 * 24 * 60, // 60 days
      };
    else
      throw new Error("No URL found in response");
  }
});
*/

// example usage:
/*
async function fetchLyricsUrl(artists: string, title: string) {
  // fetch from cache, else fetch via XHR
  const lyricsUrl = await lyricsUrlCache.get(artists, title);
}
*/


// example TieredCache data storage overview:
/*

__tc-lyricsUrl: {
  items: [
    {
      k: "artist1-title1",                    // key / compound key
      d: "https://genius.com/artist1-title1", // data
      c: 1699999999999,                       // created timestamp
      e: 1699999999999,                       // edited timestamp
      a: 1699999999999,                       // last accessed timestamp
      r: 17,                                  // reads amount
    },
  ],
}

*/
