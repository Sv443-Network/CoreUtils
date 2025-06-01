<div align="center" style="text-align: center;">

# CoreUtils
Cross-platform, general-purpose, JavaScript core library for Node, Deno and the browser.  
Intended to be used in conjunction with [`@sv443-network/userutils`](https://github.com/Sv443-Network/UserUtils) and [`@sv443-network/djsutils`](https://github.com/Sv443-Network/DJSUtils), but can be used independently as well.

### [Documentation](./docs.md#readme) &bull; [Features](#features) &bull; [Installation](#installation) &bull; [License](./LICENSE.txt) &bull; [Changelog](./CHANGELOG.md)

</div>
<br>

## Features

- [**Array:**](./docs.md#array)
  - 🟣 [`function randomItem()`](./docs.md#function-randomitem) - Returns a random item from the given array
  - 🟣 [`function randomItemIndex()`](./docs.md#function-randomitemindex) - Returns a random array item and index as a tuple
  - 🟣 [`function randomizeArray()`](./docs.md#function-randomizearray) - Returns a new array with the items in random order
  - 🟣 [`function takeRandomItem()`](./docs.md#function-takerandomitem) - Returns a random array item and mutates the array to remove it
  - 🟣 [`function takeRandomItemIndex()`](./docs.md#function-randomitemindex) - Returns a random array item and index as a tuple and mutates the array to remove it
  - 🔷 [`type NonEmptyArray`](./docs.md#type-nonemptyarray) - Non-empty array type
- [**Colors:**](./docs.md#colors)
  - 🟣 [`function darkenColor()`](./docs.md#function-darkencolor) - Darkens the given color by the given percentage
  - 🟣 [`function hexToRgb()`](./docs.md#function-hextorgb) - Converts a hex color string to an RGB object
  - 🟣 [`function lightenColor()`](./docs.md#function-lightencolor) - Lightens the given color by the given percentage
  - 🟣 [`function rgbToHex()`](./docs.md#function-rgbtohex) - Converts an RGB object to a hex color string
- [**Crypto:**](./docs.md#crypto)
  - 🟣 [`function abtoa()`](./docs.md#function-abtoa) - Converts an ArrayBuffer to a string
  - 🟣 [`function atoab()`](./docs.md#function-atoab) - Converts a string to an ArrayBuffer
  - 🟣 [`function compress()`](./docs.md#function-compress) - Compresses the given string using the given algorithm and encoding
  - 🟣 [`function decompress()`](./docs.md#function-decompress) - Decompresses the given string using the given algorithm and encoding
  - 🟣 [`function computeHash()`](./docs.md#function-computehash) - Computes a string's hash using the given algorithm
  - 🟣 [`function randomId()`](./docs.md#function-randomid) - Generates a random ID of the given length
- [**DataStore:**](./docs.md#datastore) - Cross-platform, general-purpose, sync/async hybrid, JSON-serializable database infrastructure:
  - 🟧 [`class DataStore`](./docs.md#class-datastore) - The main class for the data store
    - 🔷 [`type DataStoreOptions`](./docs.md#type-datastoreoptions) - Options for the data store
    - 🔷 [`type DataMigrationsDict`](./docs.md#type-datamigrationsdict) - Dictionary of data migration functions
  - 🟧 [`class DataStoreSerializer`](./docs.md#class-datastoreserializer) - Serializes and deserializes data for multiple DataStore instances
    - 🔷 [`type DataStoreSerializerOptions`](./docs.md#type-datastoreserializeroptions) - Options for the DataStoreSerializer
    - 🔷 [`type LoadStoresDataResult`](./docs.md#type-loadstoresdataresult) - Result of calling [`loadStoresData()`](./docs.md#datastoreserializer-loadstoresdata)
    - 🔷 [`type SerializedDataStore`](./docs.md#type-serializeddatastore) - Meta object and serialized data of a DataStore instance
    - 🔷 [`type StoreFilter`](./docs.md#type-storefilter) - Filter for selecting data stores
  - 🟧 [`class DataStoreEngine`](./docs.md#class-datastoreengine) - Base class for DataStore storage engines, which handle the data storage
  - [Storage Engines:](./docs.md#storage-engines)
    - 🟧 [`class BrowserStorageEngine`](./docs.md#class-browserstorageengine) - Storage engine for browser environments (localStorage, sessionStorage)
      - 🔷 [`type BrowserStorageEngineOptions`](./docs.md#browserstorageengineoptions) - Options for the browser storage engine
    - 🟧 [`class FileStorageEngine`](./docs.md#class-FileStorageEngine) - File-based storage engine for Node.js and Deno
      - 🔷 [`type FileStorageEngineOptions`](./docs.md#FileStorageEngineoptions) - Options for the file storage engine
- [**Debouncer:**](./docs.md#debouncer)
  - 🟣 [`function debounce()`](./docs.md#function-debounce) - Function wrapper for the [`Debouncer` class](./docs.md#class-debouncer)
  - 🟧 [`class Debouncer`](./docs.md#class-debouncer) - Class that manages listeners whose calls are rate-limited
    - 🔷 [`type DebouncerType`](./docs.md#type-debouncertype) - The triggering type for the debouncer
    - 🔷 [`type DebouncedFunction`](./docs.md#type-debouncedfunction) - Function type that is returned by the [`debounce()` function](./docs.md#function-debounce)
    - 🔷 [`type DebouncerEventMap`](./docs.md#type-debouncereventmap) - Event map type for the [`Debouncer` class](./docs.md#class-debouncer)
- [**Errors:**](./docs.md#errors)
  - 🟧 [`class DatedError`](./docs.md#class-datederror) - Base error class with a `date` property
    - 🟧 [`class ChecksumMismatchError`](./docs.md#class-checksummismatcherror) - Error thrown when two checksums don't match
    - 🟧 [`class MigrationError`](./docs.md#class-migrationerror) - Error thrown in a failed data migration
    - 🟧 [`class ValidationError`](./docs.md#class-validationerror) - Error while validating data
- [**Math:**](./docs.md#math)
  - 🟣 [`function bitSetHas()`](./docs.md#function-bitsethas) - Checks if a bit is set in a bitset
  - 🟣 [`function clamp()`](./docs.md#function-clamp) - Clamps a number between a given range
  - 🟣 [`function digitCount()`](./docs.md#function-digitcount) - Returns the number of digits in a number
  - 🟣 [`function formatNumber()`](./docs.md#function-formatnumber) - Formats a number to a string using the given locale and format identifier
    - 🔷 [`type NumberFormat`](./docs.md#type-numberformat) - Number format identifier
  - 🟣 [`function mapRange()`](./docs.md#function-maprange) - Maps a number from one range to another
  - 🟣 [`function randRange()`](./docs.md#function-randrange) - Returns a random number in the given range
  - 🟣 [`function roundFixed()`](./docs.md#function-roundfixed) - Rounds the given number to the given number of decimal places
  - 🟣 [`function valsWithin()`](./docs.md#function-valswithin) - Checks if the given numbers are within a certain range of each other
- [**Misc:**](./docs.md#misc)
  - 🟣 [`function consumeGen()`](./docs.md#function-consumegen) - Consumes a [`ValueGen` object](./docs.md#type-valuegen)
    - 🔷 [`type ValueGen`](./docs.md#type-valuegen) - A value that can be either type T, or a sync or async function that returns T
  - 🟣 [`function consumeStringGen()`](./docs.md#function-consumestringgen) - Consumes a [`StringGen` object](./docs.md#type-stringgen)
    - 🔷 [`type StringGen`](./docs.md#type-stringgen) - A value that can be either of type string, or a sync or async function that returns a string
  - 🟣 [`function fetchAdvanced()`](./docs.md#function-fetchadvanced) - Wrapper around [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with options like a timeout
    - 🔷 [`type FetchAdvancedOpts`](./docs.md#type-fetchadvancedopts) - Options for the [`fetchAdvanced()` function](./docs.md#function-fetchadvanced)
  - 🟣 [`function getListLength()`](./docs.md#function-getlistlength) - Returns the length of a [`ListLike` object](./docs.md#type-listlike)
    - 🔷 [`type ListLike`](./docs.md#type-listlike) - Any value with a quantifiable `length`, `count` or `size` property
  - 🟣 [`function pauseFor()`](./docs.md#function-pausefor) - Pauses async execution for the given amount of time
  - 🟣 [`function pureObj()`](./docs.md#function-pureobj) - Applies an object's props to a null object (object without prototype chain) or just returns a new null object
  - 🟣 [`function setImmediateInterval()`](./docs.md#function-setimmediateinterval) - Like `setInterval()`, but instantly calls the callback and supports passing an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
  - 🟣 [`function setImmediateTimeoutLoop()`](./docs.md#function-setimmediatetimeoutloop) - Like a recursive `setTimeout()` loop, but instantly calls the callback and supports passing an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
  - 🟣 [`function scheduleExit()`](./docs.md#function-scheduleexit) - Schedules a process exit after the next event loop tick, to allow operations like IO writes to finish.
- [**NanoEmitter:**](./docs.md#nanoemitter)
  - 🟧 [`class NanoEmitter`](./docs.md#class-nanoemitter) - Simple, lightweight event emitter class that can be used in both FP and OOP, inspired by [`EventEmitter` from `node:events`](https://nodejs.org/api/events.html#class-eventemitter), based on [`nanoevents`](https://npmjs.com/package/nanoevents)
    - 🔷 [`type NanoEmitterOptions`](./docs.md#type-nanoemitteroptions) - Options for the [`NanoEmitter` class](./docs.md#class-nanoemitter)
- [**Text:**](./docs.md#text)
  - 🟣 [`function autoPlural()`](./docs.md#function-autoplural) - Turns the given term into its plural form, depending on the given number or list length
  - 🟣 [`function capitalize()`](./docs.md#function-capitalize) - Capitalizes the first letter of the given string
  - 🟣 [`function createProgressBar()`](./docs.md#function-createprogressbar) - Creates a progress bar string with the given percentage and length
    - 🟩 [`const defaultPbChars`](./docs.md#const-defaultpbchars) - Default characters for the progress bar
    - 🔷 [`type ProgressBarChars`](./docs.md#type-progressbarchars) - Type for the progress bar characters object
  - 🟣 [`function joinArrayReadable()`](./docs.md#function-joinarrayreadable) - Joins the given array into a string, using the given separators and last separator
  - 🟣 [`function secsToTimeStr()`](./docs.md#function-sectostimestr) - Turns the given number of seconds into a string in the format `(hh:)mm:ss` with intelligent zero-padding
  - 🟣 [`function truncStr()`](./docs.md#function-truncstr) - Truncates the given string to the given length
<!-- - *[**TieredCache:**](./docs.md#tieredcache)
  - 🟧 *[`class TieredCache`](./docs.md#class-tieredcache) - A multi-tier cache that uses multiple storage engines with different expiration times
    - 🔷 *[`type TieredCacheOptions`](./docs.md#type-tieredcacheoptions) - Options for the [`TieredCache` class](./docs.md#class-tieredcache)
    - 🔷 *[`type TieredCachePropagateTierOptions`](./docs.md#type-tieredcachestaleoptions) - Entry propagation options for each tier
    - 🔷 *[`type TieredCacheStaleOptions`](./docs.md#type-tieredcachepropagatetieroptions) - Entry staleness options for each tier
    - 🔷 *[`type TieredCacheTierOptions`](./docs.md#type-tieredcachetieroptions) - Options for each tier of a [`TieredCache` instance](./docs.md#class-tieredcache)
- *[**Translate:**](./docs.md#translate)
  - 🟧 *[`class Translate`](./docs.md#class-translate) - JSON-based translation system supporting transformation hooks, value injection, nested objects, etc.
  - 🔷 *[`type TransformFn`](./docs.md#type-transformfn) - The type of the transformation hook functions
  - 🔷 *[`type TransformFnProps`](./docs.md#type-transformfnprops) - The properties passed to the transformation functions
  - 🔷 *[`type TranslateOptions`](./docs.md#type-translateoptions) - The options for the [`Translate` class](./docs.md#class-translate)
  - 🔷 *[`type TrKeys`](./docs.md#type-trkeys) - Generic type that gives you a union of keys from the passed [`TrObject` object](./docs.md#type-trobject)
  - 🔷 *[`type TrObject`](./docs.md#type-trobject) - The translation object for a specific language -->
- [**Misc. Types:**](./docs.md#types)
  - 🔷 [`type LooseUnion`](./docs.md#type-looseunion) - A union type that allows for autocomplete suggestions as well as substitutions of the same type
  - 🔷 [`type ListLike`](./docs.md#type-listlike) - Any value with a quantifiable `length`, `count` or `size` property
  - 🔷 [`type Newable`](./docs.md#type-newable) - Any class reference that can be instantiated with `new`
  - 🔷 [`type NonEmptyArray`](./docs.md#type-nonemptyarray) - Non-empty array type
  - 🔷 [`type NonEmptyString`](./docs.md#type-nonemptystring) - String type with at least one character
  - 🔷 [`type NumberFormat`](./docs.md#type-numberformat) - Number format identifier
  - 🔷 [`type Prettify`](./docs.md#type-prettify) - Makes the structure of a type more readable by fully expanding it (recursively)
  - 🔷 [`type SerializableVal`](./docs.md#type-serializableval) - Any value that can be serialized to JSON
  - 🔷 [`type StringGen`](./docs.md#type-stringgen) - A value that can be either of type string, or a sync or async function that returns a string
  - 🔷 [`type ValueGen`](./docs.md#type-valuegen) - A value that can be either the generic type T, or a sync or async function that returns T
  - 🔷 [`type Stringifiable`](./docs.md#type-stringifiable) - Any value that can be implicitly converted to a string

> [!NOTE]  
> 🟣 = function  
> 🟧 = class  
> 🔷 = type  
> 🟩 = const

<br>

## Installation
- If you are using Node.js or Deno, install the package from NPM or JSR via your favorite package manager:
```bash
npm i @sv443-network/coreutils
pnpm i @sv443-network/coreutils
yarn add @sv443-network/coreutils
npx jsr install @sv443-network/coreutils
deno add jsr:@sv443-network/coreutils
```
- If you are in a DOM environment, you can include the UMD bundle using your favorite CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/@sv443-network/coreutils@latest/dist/CoreUtils.min.umd.js"></script>
<script src="https://unpkg.com/@sv443-network/coreutils@latest/dist/CoreUtils.min.umd.js"></script>
<script src="https://esm.sh/@sv443-network/coreutils@latest/dist/CoreUtils.min.umd.js"></script>
```
- Then, import parts of the library as needed:
```ts
// >> EcmaScript Modules (ESM):

// - import parts of the library:
import { randomItem } from "@sv443-network/coreutils";
// - or import the full library:
import * as CoreUtils from "@sv443-network/coreutils";
// - or import raw TS files, after installing via JSR:
import { DataStore } from "jsr:@sv443-network/coreutils/lib/DataStore.ts";

// >> CommonJS (CJS):

// - import parts of the library:
const { debounce } = require("@sv443-network/coreutils");
// - or import the full library:
const CoreUtils = require("@sv443-network/coreutils");

// >> Universal Module Definition (UMD):

// - to make the global variable `CoreUtils` available, import this file:
// "@sv443-network/coreutils/dist/CoreUtils.min.umd.js"
// - or import the library on your HTML page:
// <script src="https://cdn.jsdelivr.net/npm/@sv443-network/coreutils@latest/dist/CoreUtils.min.umd.js"></script>
```
