/**
 * @module TieredCache
 * This module contains the TieredCache class, which is a cache that can have multiple tiers with different max TTLs, with data being moved between tiers based on what is fetched the most.
 */

/**
 * Cache class that can have multiple tiers with different max TTLs, with data being moved between tiers based on what is fetched the most.  
 * Persists data using DataStore and DataStoreEngines.  
 * The zeroth tier is the most persistent, and the last tier is the most volatile.
 */
export class TieredCache {

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
      // (id = "_tc_lyricsUrl-0")
      memCache: true,
      engine: () => new BrowserStorageEngine({
        type: "localStorage",
      }),
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
      // (id = "_tc_lyricsUrl-1")
      memCache: false,
      engine: () => new JSONFileStorageEngine({
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

_tc_lyricsUrl: {
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
