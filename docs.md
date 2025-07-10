# CoreUtils Documentation
Cross-platform, general-purpose, JavaScript core library for Node, Deno and the browser.  
Intended to be used in conjunction with [`@sv443-network/coreutils`](https://github.com/Sv443-Network/UserUtils) and [`@sv443-network/djsutils`](https://github.com/Sv443-Network/DJSUtils), but can be used independently as well.  
  
If you like using this library, please consider [supporting the development ❤️](https://github.com/sponsors/Sv443)

<br>


<!-- #region Preamble -->
## Preamble:
This library is written in TypeScript and contains builtin TypeScript declarations, but it will also work in plain JavaScript after removing the `: type` annotations in the example code snippets.  
  
Each feature's example code snippet can be expanded by clicking on the text "Example - click to view".  
The signatures and examples are written in TypeScript and use ESM import syntax to show you which types need to be provided and will be returned.  
The library itself supports importing an ESM, CommonJS or global variable definition bundle, depending on your use case.  
  
If the signature section contains multiple signatures of the function, each occurrence represents an overload and you can choose which one you want to use.  
They will also be further explained in the description below that section.  
  
Warning emojis (⚠️) denote special cautions or important notes that you should be aware of when using the feature.  
  
If you need help with something, please [create a new discussion](https://github.com/Sv443-Network/CoreUtils/discussions) or [join my Discord server.](https://dc.sv443.net/)  
For submitting bug reports or feature requests, please use the [GitHub issue tracker.](https://github.com/Sv443-Network/CoreUtils/issues)

<br>

<!-- #region Features -->
## Table of Contents:
- [**Preamble** (info about the documentation)](#preamble)
- [**Features**](#features)
  - [**Array:**](#array)
    - 🟣 [`function randomItem()`](#function-randomitem) - Returns a random item from the given array
    - 🟣 [`function randomItemIndex()`](#function-randomitemindex) - Returns a random array item and index as a tuple
    - 🟣 [`function randomizeArray()`](#function-randomizearray) - Returns a new array with the items in random order
    - 🟣 [`function takeRandomItem()`](#function-takerandomitem) - Returns a random array item and mutates the array to remove it
    - 🟣 [`function takeRandomItemIndex()`](#function-randomitemindex) - Returns a random array item and index as a tuple and mutates the array to remove it
    - 🔷 [`type NonEmptyArray`](#type-nonemptyarray) - Non-empty array type
  - [**Colors:**](#colors)
    - 🟣 [`function darkenColor()`](#function-darkencolor) - Darkens the given color by the given percentage
    - 🟣 [`function hexToRgb()`](#function-hextorgb) - Converts a hex color string to an RGB object
    - 🟣 [`function lightenColor()`](#function-lightencolor) - Lightens the given color by the given percentage
    - 🟣 [`function rgbToHex()`](#function-rgbtohex) - Converts an RGB object to a hex color string
  - [**Crypto:**](#crypto)
    - 🟣 [`function abtoa()`](#function-abtoa) - Converts an ArrayBuffer to a string
    - 🟣 [`function atoab()`](#function-atoab) - Converts a string to an ArrayBuffer
    - 🟣 [`function compress()`](#function-compress) - Compresses the given string using the given algorithm and encoding
    - 🟣 [`function decompress()`](#function-decompress) - Decompresses the given string using the given algorithm and encoding
    - 🟣 [`function computeHash()`](#function-computehash) - Computes a string's hash using the given algorithm
    - 🟣 [`function randomId()`](#function-randomid) - Generates a random ID of the given length
  - [**DataStore:**](#datastore) - Cross-platform, general-purpose, sync/async hybrid, JSON-serializable database infrastructure:
    - 🟧 [`class DataStore`](#class-datastore) - The main class for the data store
      - 🔷 [`type DataStoreOptions`](#type-datastoreoptions) - Options for the data store
      - 🔷 [`type DataMigrationsDict`](#type-datamigrationsdict) - Dictionary of data migration functions
      - 🔷 [`type DataStoreData`](#type-datastoredata) - The type of the serializable data
    - 🟧 [`class DataStoreSerializer`](#class-datastoreserializer) - Serializes and deserializes data for multiple DataStore instances
      - 🔷 [`type DataStoreSerializerOptions`](#type-datastoreserializeroptions) - Options for the DataStoreSerializer
      - 🔷 [`type LoadStoresDataResult`](#type-loadstoresdataresult) - Result of calling [`loadStoresData()`](#datastoreserializer-loadstoresdata)
      - 🔷 [`type SerializedDataStore`](#type-serializeddatastore) - Meta object and serialized data of a DataStore instance
      - 🔷 [`type StoreFilter`](#type-storefilter) - Filter for selecting data stores
    - 🟧 [`class DataStoreEngine`](#class-datastoreengine) - Base class for DataStore storage engines, which handle the data storage
      - 🔷 [`type DataStoreEngineDSOptions`](#type-datastoreenginedsoptions) - Reduced version of [`DataStoreOptions`](#type-datastoreoptions)
    - [Storage Engines:](#storage-engines)
      - 🟧 [`class BrowserStorageEngine`](#class-browserstorageengine) - Storage engine for browser environments (localStorage, sessionStorage)
        - 🔷 [`type BrowserStorageEngineOptions`](#browserstorageengineoptions) - Options for the browser storage engine
      - 🟧 [`class FileStorageEngine`](#class-FileStorageEngine) - File-based storage engine for Node.js and Deno
        - 🔷 [`type FileStorageEngineOptions`](#FileStorageEngineoptions) - Options for the file storage engine
  - [**Debouncer:**](#debouncer)
    - 🟣 [`function debounce()`](#function-debounce) - Function wrapper for the [`Debouncer` class](#class-debouncer)
    - 🟧 [`class Debouncer`](#class-debouncer) - Class that manages listeners whose calls are rate-limited
      - 🔷 [`type DebouncerType`](#type-debouncertype) - The triggering type for the debouncer
      - 🔷 [`type DebouncedFunction`](#type-debouncedfunction) - Function type that is returned by the [`debounce()` function](#function-debounce)
      - 🔷 [`type DebouncerEventMap`](#type-debouncereventmap) - Event map type for the [`Debouncer` class](#class-debouncer)
  - [**Errors:**](#errors)
    - 🟧 [`class DatedError`](#class-datederror) - Base error class with a `date` property
      - 🟧 [`class ChecksumMismatchError`](#class-checksummismatcherror) - Error thrown when two checksums don't match
      - 🟧 [`class MigrationError`](#class-migrationerror) - Error thrown in a failed data migration
      - 🟧 [`class ValidationError`](#class-validationerror) - Error while validating data
  - [**Math:**](#math)
    - 🟣 [`function bitSetHas()`](#function-bitsethas) - Checks if a bit is set in a bitset
    - 🟣 [`function clamp()`](#function-clamp) - Clamps a number between a given range
    - 🟣 [`function digitCount()`](#function-digitcount) - Returns the number of digits in a number
    - 🟣 [`function formatNumber()`](#function-formatnumber) - Formats a number to a string using the given locale and format identifier
      - 🔷 [`type NumberFormat`](#type-numberformat) - Number format identifier
    - 🟣 [`function mapRange()`](#function-maprange) - Maps a number from one range to another
    - 🟣 [`function overflowVal()`](#function-overflowVal) - Makes sure a number is in a range by over- & underflowing it
    - 🟣 [`function randRange()`](#function-randrange) - Returns a random number in the given range
    - 🟣 [`function roundFixed()`](#function-roundfixed) - Rounds the given number to the given number of decimal places
    - 🟣 [`function valsWithin()`](#function-valswithin) - Checks if the given numbers are within a certain range of each other
  - [**Misc:**](#misc)
    - 🟣 [`function consumeGen()`](#function-consumegen) - Consumes a [`ValueGen` object](#type-valuegen)
      - 🔷 [`type ValueGen`](#type-valuegen) - A value that can be either type T, or a sync or async function that returns T
    - 🟣 [`function consumeStringGen()`](#function-consumestringgen) - Consumes a [`StringGen` object](#type-stringgen)
      - 🔷 [`type StringGen`](#type-stringgen) - A value that can be either of type string, or a sync or async function that returns a string
    - 🟣 [`function fetchAdvanced()`](#function-fetchadvanced) - Wrapper around [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with options like a timeout
      - 🔷 [`type FetchAdvancedOpts`](#type-fetchadvancedopts) - Options for the [`fetchAdvanced()` function](#function-fetchadvanced)
    - 🟣 [`function getListLength()`](#function-getlistlength) - Returns the length of a [`ListLike` object](#type-listlike)
      - 🔷 [`type ListLike`](#type-listlike) - Any value with a quantifiable `length`, `count` or `size` property
    - 🟣 [`function pauseFor()`](#function-pausefor) - Pauses async execution for the given amount of time
    - 🟣 [`function pureObj()`](#function-pureobj) - Applies an object's props to a null object (object without prototype chain) or just returns a new null object
    - 🟣 [`function setImmediateInterval()`](#function-setimmediateinterval) - Like `setInterval()`, but instantly calls the callback and supports passing an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
    - 🟣 [`function setImmediateTimeoutLoop()`](#function-setimmediatetimeoutloop) - Like a recursive `setTimeout()` loop, but instantly calls the callback and supports passing an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
    - 🟣 [`function scheduleExit()`](#function-scheduleexit) - Schedules a process exit after the next event loop tick, to allow operations like IO writes to finish.
  - [**NanoEmitter:**](#nanoemitter)
    - 🟧 [`class NanoEmitter`](#class-nanoemitter) - Simple, lightweight event emitter class that can be used in both FP and OOP, inspired by [`EventEmitter` from `node:events`](https://nodejs.org/api/events.html#class-eventemitter), based on [`nanoevents`](https://npmjs.com/package/nanoevents)
      - 🔷 [`type NanoEmitterOptions`](#type-nanoemitteroptions) - Options for the [`NanoEmitter` class](#class-nanoemitter)
  - [**Text:**](#text)
    - 🟣 [`function autoPlural()`](#function-autoplural) - Turns the given term into its plural form, depending on the given number or list length
    - 🟣 [`function capitalize()`](#function-capitalize) - Capitalizes the first letter of the given string
    - 🟣 [`function createProgressBar()`](#function-createprogressbar) - Creates a progress bar string with the given percentage and length
      - 🟩 [`const defaultPbChars`](#const-defaultpbchars) - Default characters for the progress bar
      - 🔷 [`type ProgressBarChars`](#type-progressbarchars) - Type for the progress bar characters object
    - 🟣 [`function joinArrayReadable()`](#function-joinarrayreadable) - Joins the given array into a string, using the given separators and last separator
    - 🟣 [`function secsToTimeStr()`](#function-secstotimestr) - Turns the given number of seconds into a string in the format `(hh:)mm:ss` with intelligent zero-padding
    - 🟣 [`function truncStr()`](#function-truncstr) - Truncates the given string to the given length
  <!-- - *[**TieredCache:**](#tieredcache)
    - 🟧 *[`class TieredCache`](#class-tieredcache) - A multi-tier cache that uses multiple storage engines with different expiration times
      - 🔷 *[`type TieredCacheOptions`](#type-tieredcacheoptions) - Options for the [`TieredCache` class](#class-tieredcache)
      - 🔷 *[`type TieredCachePropagateTierOptions`](#type-tieredcachestaleoptions) - Entry propagation options for each tier
      - 🔷 *[`type TieredCacheStaleOptions`](#type-tieredcachepropagatetieroptions) - Entry staleness options for each tier
      - 🔷 *[`type TieredCacheTierOptions`](#type-tieredcachetieroptions) - Options for each tier of a [`TieredCache` instance](#class-tieredcache)
  - *[**Translate:**](#translate)
    - 🟧 *[`class Translate`](#class-translate) - JSON-based translation system supporting transformation hooks, value injection, nested objects, etc.
    - 🔷 *[`type TransformFn`](#type-transformfn) - The type of the transformation hook functions
    - 🔷 *[`type TransformFnProps`](#type-transformfnprops) - The properties passed to the transformation functions
    - 🔷 *[`type TranslateOptions`](#type-translateoptions) - The options for the [`Translate` class](#class-translate)
    - 🔷 *[`type TrKeys`](#type-trkeys) - Generic type that gives you a union of keys from the passed [`TrObject` object](#type-trobject)
    - 🔷 *[`type TrObject`](#type-trobject) - The translation object for a specific language -->
  - [**Misc. Types:**](#types)
    - 🔷 [`type LooseUnion`](#type-looseunion) - A union type that allows for autocomplete suggestions as well as substitutions of the same type
    - 🔷 [`type ListLike`](#type-listlike) - Any value with a quantifiable `length`, `count` or `size` property
    - 🔷 [`type Newable`](#type-newable) - Any class reference that can be instantiated with `new`
    - 🔷 [`type NonEmptyArray`](#type-nonemptyarray) - Non-empty array type
    - 🔷 [`type NonEmptyString`](#type-nonemptystring) - String type with at least one character
    - 🔷 [`type NumberFormat`](#type-numberformat) - Number format identifier
    - 🔷 [`type Prettify`](#type-prettify) - Makes the structure of a type more readable by fully expanding it (recursively)
    - 🔷 [`type SerializableVal`](#type-serializableval) - Any value that can be serialized to JSON
    - 🔷 [`type StringGen`](#type-stringgen) - A value that can be either of type string, or a sync or async function that returns a string
    - 🔷 [`type ValueGen`](#type-valuegen) - A value that can be either the generic type T, or a sync or async function that returns T
    - 🔷 [`type Stringifiable`](#type-stringifiable) - Any value that can be implicitly converted to a string

> [!NOTE]  
> 🟣 = function  
> 🟧 = class  
> 🔷 = type  
> 🟩 = const

<br><br><br>


<!-- #region Features -->
## Features:

<br>

<!-- #region array -->
## Array

### `function randomItem()`
Signature:
```ts
randomItem<TItem = unknown>(array: TItem[]): TItem | undefined;
```
  
Returns a random item from the given array.  
If the array is empty, `undefined` will be returned.  
  
<details><summary>Example - click to view</summary>

```ts
import { randomItem } from "@sv443-network/coreutils";

const arr = ["foo", "bar", "baz"];

console.log(randomItem(arr)); // "bar"
console.log(randomItem(arr)); // "bar"
console.log(randomItem(arr)); // "foo"
console.log(randomItem([]));  // undefined
```
</details>

<br>

### `function randomItemIndex()`
Signature:
```ts
randomItemIndex<TItem = unknown>(array: TItem[]): [item?: TItem, index?: number];
```
  
Returns a random item and its index as a tuple from the given array.  
If the array is empty, `undefined` will be returned for both values.  
  
<details><summary>Example - click to view</summary>

```ts
import { randomItemIndex } from "@sv443-network/coreutils";

const arr = ["foo", "bar", "baz"];

console.log(randomItemIndex(arr)); // ["bar", 1]

// if only the index is needed:
const [, myIndex] = randomItemIndex(arr);
console.log(myIndex); // 2
```
</details>

<br>

### `function randomizeArray()`
Signature:
```ts
randomizeArray<TItem = unknown>(array: TItem[]): TItem[]
```
  
Returns a new array with the items in random order.  
Doesn't mutate the original array.  
  
<details><summary>Example - click to view</summary>

```ts
import { randomizeArray } from "@sv443-network/coreutils";

const arr = ["foo", "bar", "baz"];

const randomized = randomizeArray(arr);
console.log(randomized); // ["baz", "foo", "bar"]
```
</details>

<br>

### `function takeRandomItem()`
Signature:
```ts
takeRandomItem<TItem = unknown>(arr: TItem[]): TItem | undefined;
```
  
Returns a random item from the given array and mutates the original array to remove it.  
If the array is empty, `undefined` will be returned.  
  
<details><summary>Example - click to view</summary>

```ts
import { takeRandomItem } from "@sv443-network/coreutils";

const arr = ["foo", "bar", "baz"];

console.log(takeRandomItem(arr)); // "bar"
console.log(arr); // ["foo", "baz"]

console.log(takeRandomItem(arr)); // "baz"
console.log(arr); // ["foo"]

console.log(takeRandomItem(arr)); // "foo"
console.log(arr); // []

console.log(takeRandomItem(arr)); // undefined
console.log(arr); // []
```
</details>

<br>

### `function takeRandomItemIndex()`
Signature:
```ts
takeRandomItemIndex<TItem = unknown>(arr: TItem[]): [item?: TItem, index?: number];
```
  
Returns a random item and its original index as a tuple from the given array and mutates the original array to remove it.  
If the array is empty, `undefined` will be returned for both values.  
  
<details><summary>Example - click to view</summary>

```ts
import { takeRandomItemIndex } from "@sv443-network/coreutils";

const arr = ["foo", "bar", "baz"];

while([itm, idx] = takeRandomItemIndex(arr), itm !== undefined) {
  console.log(idx, itm, arr);
}

// Logs:
// 1 "bar" ["foo", "baz"]
// 1 "baz" ["foo"]
// 0 "foo" []

console.log(takeRandomItemIndex(arr)); // [undefined, undefined]
console.log(arr); // []
```
</details>

<br><br>


<!-- #region colors -->
## Colors

<br>

### `function darkenColor()`
Signature:
```ts
function darkenColor(color: string, percent: number, upperCase = false): string;
```
  
Darkens the given CSS color value (in `#HEX`, `HEX`, `rgb()` or `rgba()` format) by the given decimal percentage.  
A negative percentage will lighten the color, just like the [`lightenColor()` function.](#function-lightencolor)  
The color values will not exceed their maximum range (`00-FF` / `0-255`) and the alpha value will be preserved.  
Returns the new color in the same format as the input.  
Throws if the color format is invalid or not supported.  
  
<details><summary>Example - click to view</summary>

```ts
import { darkenColor } from "@sv443-network/coreutils";

darkenColor("#1affe3", 20);                   // #15ccb6
darkenColor("#1affe3", 20, true);             // #15CCB6
darkenColor("1affe369", 20);                  // 15ccb669
darkenColor("rgb(26, 255, 227)", 20);       // rgb(20.8, 204, 181.6)
darkenColor("rgba(26, 255, 227, 0.2)", 20); // rgba(20.8, 204, 181.6, 0.2)

// invalid:
darkenColor("#1affe3");    // #nannannan
// @ts-expect-error
darkenColor("rgba()", 20); // TypeError: Invalid RGB/RGBA color format
```
</details>

<br>

### `function hexToRgb()`
Signature:
```ts
function hexToRgb(hex: string): [red: number, green: number, blue: number, alpha?: number];
```
  
Converts the given hex color string in the format `#RRGGBB`, `#RRGGBBAA`, `#RGB` or `#RGBA` (even without the `#` hash symbol) to an RGB(A) tuple.  
R, G and B will be an integer in the range `0-255` and alpha is a float in the range `0-1`, or `undefined` if no alpha channel exists.  
  
<details><summary>Example - click to view</summary>

```ts
import { hexToRgb } from "@sv443-network/coreutils";

console.log(hexToRgb("#1affe3"));   // [ 26, 255, 227, undefined ]
console.log(hexToRgb("1234"));      // [ 17, 34, 51, 0.26666666666666666 ]
console.log(hexToRgb("#1affe369")); // [ 26, 255, 227, 0.4117647058823529 ]
console.log(hexToRgb(""));          // [ 0, 0, 0, undefined ]
```
</details>

<br>

### `function lightenColor()`
Signature:
```ts
function lightenColor(color: string, percent: number, upperCase = false): string;
```
  
Lightens the given CSS color value (in `#HEX`, `HEX`, `rgb()` or `rgba()` format) by the given decimal percentage.  
A negative percentage will darken the color.  
Works by calling the [`darkenColor()` function](#function-darkencolor) after multiplying the percentage by `-1`.  
  
See the [`darkenColor()` function](#function-darkencolor) for an example.  

<br>

### `function rgbToHex()`
Signature:
```ts
function rgbToHex(red: number, green: number, blue: number, alpha?: number, withHash = true, upperCase = false): string;
```
  
Converts the given RGB(A) values to a hex color string in the format `#RRGGBB` or `#RRGGBBAA`.  
The `red`, `green` and `blue` arguments must be integers in the range `0-255`, the `alpha` argument can be a float in the range `0-1`.  
The `withHash` argument determines if the returned string should start with a `#` hash symbol.  
The `upperCase` argument determines if the hex string should be in upper case.  
  
<details><summary>Example - click to view</summary>

```ts
import { rgbToHex } from "@sv443-network/coreutils";

console.log(rgbToHex(18, 52, 86, 0.47058823529411764)); // #12345678
console.log(rgbToHex(18, 52, 86));                      // #123456
console.log(rgbToHex());                                // #nannannan
```
</details>

<br><br>


<!-- #region crypto -->
## Crypto

<br>

### `function abtoa()`
Signature:
```ts
function abtoa(buf: Uint8Array): string;
```
  
Converts an ArrayBuffer (Uint8Array) to a base64-encoded (ASCII) string.  
Used to encode a value to be later decoded with the [`atoab()` function](#function-atoab).  
  
<details><summary>Example - click to view</summary>

```ts
import { abtoa } from "@sv443-network/coreutils";

const buffer = new ArrayBuffer(8);
const view = new Uint8Array(buffer);
view.set([1, 2, 3, 4, 5, 6, 7, 8]);
const base64 = abtoa(view);
console.log(base64); // AQIDBAUGBwg=
```
</details>

<br>

### `function atoab()`
Signature:
```ts
function atoab(str: string): Uint8Array;
```
  
Converts a base64-encoded (ASCII) string to an ArrayBuffer (Uint8Array).  
Used to decode a value previously encoded with the [`abtoa()` function](#function-abtoa).  
  
<details><summary>Example - click to view</summary>

```ts
import { atoab } from "@sv443-network/coreutils";

const base64 = "AQIDBAUGBwg="; // see abtoa() example
const buffer = atoab(base64);
console.log(buffer); // Uint8Array(8) [ 1, 2, 3, 4, 5, 6, 7, 8 ]
```
</details>

<br>

### `function compress()`
Signature:
```ts
function compress(input: Stringifiable | Uint8Array, compressionFormat: CompressionFormat, outputType: "string" | "arrayBuffer" = "string"): Promise<Uint8Array | string>;
```
  
Compresses the given string or ArrayBuffer (Uint8Array) using the given algorithm and encoding.  
The `input` argument can be a [`Stringifiable`](#type-stringifiable) object or an ArrayBuffer (Uint8Array).  
The `compressionFormat` argument can usually be either `gzip`, `deflate` or `deflate-raw`.  
The `outputType` argument determines if the returned value should be a base64-encoded string or an ArrayBuffer (Uint8Array).  
  
<details><summary>Example - click to view</summary>

```ts
import { compress, decompress } from "@sv443-network/coreutils";

const str = "Hello, world!".repeat(1000);
const compressed = await compress(str, "gzip");
console.log(compressed); // "H4sIAAAAAAAACu3HoQ0AIAwAsFfAc8gOAbdkyQzvcwWudY2TWWvc6twzRERERERERERERERERERERERERERERERERP7kAddDUSnIMgAA"

const decompressed = await decompress(compressed, "gzip");
console.log(str === decompressed); // true
```
</details>

<br>

### `function decompress()`
Signature:
```ts
function decompress(input: Stringifiable | Uint8Array, compressionFormat: CompressionFormat, outputType: "string" | "arrayBuffer" = "string"): Promise<Uint8Array | string>;
```
  
Decompresses the previously compressed string or ArrayBuffer (Uint8Array) using the given algorithm and encoding.  
The `input` argument can be a [`Stringifiable`](#type-stringifiable) object or an ArrayBuffer (Uint8Array).  
The `compressionFormat` argument can usually be either `gzip`, `deflate` or `deflate-raw`.  
The `outputType` argument determines if the returned value should be a base64-encoded string or an ArrayBuffer (Uint8Array).  
  
<details><summary>Example - click to view</summary>

```ts
import { compress, decompress } from "@sv443-network/coreutils";

const str = "Hello, world!".repeat(1000);
const compressed = await compress(str, "gzip");
console.log(compressed); // "H4sIAAAAAAAACu3HoQ0AIAwAsFfAc8gOAbdkyQzvcwWudY2TWWvc6twzRERERERERERERERERERERERERERERERERP7kAddDUSnIMgAA"

const decompressed = await decompress(compressed, "gzip");
console.log(str === decompressed); // true
```
</details>

<br>

### `function computeHash()`
Signature:
```ts
function computeHash(input: string | Uint8Array, algorithm = "SHA-256"): Promise<string>;
```
  
Creates a hash / checksum of the given string or ArrayBuffer (Uint8Array) using the specified algorithm ("SHA-256" by default).  
  
- ⚠️ Uses the SubtleCrypto API so in a DOM environment this needs to run in a secure context (HTTPS).
- ⚠️ If you use this for cryptography, make sure to use a secure algorithm (under no circumstances use SHA-1) and to [salt your input.](https://en.wikipedia.org/wiki/Salt_(cryptography))

<details><summary>Example - click to view</summary>

```ts
const sha256 = await computeHash("Hello, world!");
const sha512 = await computeHash("Hello, world!", "SHA-512");

console.log(sha256); // "315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3"
console.log(sha512); // "c1527cd893c124773d811911970c8fe6e857d6df5dc9226bd8a160614c0cd963a4ddea2b94bb7d36021ef9d865d5cea294a82dd49a0bb269f51f6e7a57f79421"
```
</details>

<br>

### `function randomId()`
Signature:
```ts
function randomId(length = 16, radix = 16, enhancedEntropy = false, randomCase = true): string;
```
  
Generates a random ID of a given length and [radix (base).](https://en.wikipedia.org/wiki/Radix)  
  
The default length is 16 and the default radix is 16 (hexadecimal).  
You may change the radix to get digits from different numerical systems.  
Use 2 for binary, 8 for octal, 10 for decimal, 16 for hexadecimal and 36 for alphanumeric.  
  
If `enhancedEntropy` is set to true (false by default), the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) is used for generating the random numbers.  
Note that this makes the function call take longer, but the generated IDs will have a higher entropy.  
  
If `randomCase` is set to true (which it is by default), the generated ID will contain both upper and lower case letters.  
This randomization is also affected by the `enhancedEntropy` setting, unless there are no alphabetic characters in the output in which case it will be skipped.  
  
Throws a RangeError if the length is less than 1 or the radix is less than 2 or greater than 36.  
  
- ⚠️ This is not suitable for generating anything related to cryptography! Use [SubtleCrypto's `generateKey()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey) for that instead.  
  
<details><summary>Example - click to view</summary>

```ts
import { randomId } from "@sv443-network/coreutils";

randomId();                    // "1bda419a73629d4f" (length 16, radix 16)
randomId(10);                  // "f86cd354a4"       (length 10, radix 16)
randomId(10, 2);               // "1010001101"       (length 10, radix 2)
randomId(10, 10);              // "0183428506"       (length 10, radix 10)
randomId(10, 36, false, true); // "z46jFPa37R"       (length 10, radix 36, random case)


// performance benchmark:

function benchmark(enhancedEntropy: boolean, randomCase: boolean) {
  const timestamp = Date.now();
  for(let i = 0; i < 10_000; i++)
    randomId(16, 36, enhancedEntropy, randomCase);
  console.log(`Generated 10k in ${Date.now() - timestamp}ms`)
}

// using Math.random():
benchmark(false, false); // Generated 10k in 239ms
benchmark(false, true);  // Generated 10k in 248ms

// using crypto.getRandomValues():
benchmark(true, false);  // Generated 10k in 1076ms
benchmark(true, true);   // Generated 10k in 1054ms

// 3rd and 4th have a similar time, but in reality the 4th blocks the event loop for much longer
```
</details>

<br><br>


<!-- #region DataStore -->
## DataStore

<br>

### `class DataStore`
Signature:
```ts
class DataStore<TData extends DataStoreData>;
```
  
Usage:
```ts
const store = new DataStore(options: DataStoreOptions);
```
  
A class that manages a sync & async JSON database that is persistently saved and has an in-memory cache for synchronous access.  
Supports automatic migration of outdated data formats via configured migration functions.  
You may create as many instances as you like as long as they have different IDs.  
The class' internal methods are all declared as protected, so you can extend this class and override them if you need to add your own functionality.  
  
For info on the options object, see the [`DataStoreOptions` type.](#type-datastoreoptions)  
  
Each DataStore instance needs an engine, which is responsible for the actual data storage.  
To see a list of available engines, see the [Storage Engines section.](#storage-engines)  
To make your own engine, refer to the [`DataStoreEngine` class.](#class-datastoreengine)  
  
If you have multiple DataStore instances and you want to be able to easily and safely export and import their data, take a look at the [DataStoreSerializer class.](#class-datastoreserializer)  
It combines the data of multiple DataStore instances into a single object that can be exported and imported as a whole, including partial im- and exports.  
  
If you were using the `DataStore` class from the `@sv443-network/coreutils` package before, all your data should be migrated automatically on the first call to `loadData()`.  
  
- ⚠️ The data is serialized as a JSON string, so only JSON-compatible data can be used. Circular structures and complex objects (containing functions, symbols, etc.) will either throw an error on load and save or cause otherwise unexpected behavior. Properties with a value of `undefined` will be removed from the data prior to saving it, so use `null` instead.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { DataStore, compress, decompress } from "@sv443-network/coreutils";

/** Example: Script configuration data */
interface MyConfig {
  foo: string;
  bar: number;
  baz: string;
  qux: string;
}

/** Default data returned by getData() calls until setData() is used and also fallback data if something goes wrong */
const defaultData: MyConfig = {
  foo: "hello",
  bar: 42,
  baz: "xyz",
  qux: "something",
};
/** If any properties are added to, removed from, or renamed in the MyConfig type, increment this number */
const formatVersion = 2;
/** These are functions that migrate outdated data to the latest format - make sure a function exists for every previously used formatVersion and that no numbers are skipped! */
const migrations = {
  // migrate from format version 0 to 1
  1: (oldData: Record<string, unknown>) => {
    return {
      foo: oldData.foo,
      bar: oldData.bar,
      baz: "world",
    };
  },
  // asynchronously migrate from format version 1 to 2
  2: async (oldData: Record<string, unknown>) => {
    // using arbitrary async operations for the new format:
    const qux = await grabQuxDataAsync();
    return {
      foo: oldData.foo,
      bar: oldData.bar,
      baz: oldData.baz,
      qux,
    };
  },
};

// You probably want to export this instance (or helper functions) so you can use it anywhere in your script:
export const manager = new DataStore({
  /** A unique ID for this instance */
  id: "my-script-config",
  /** Default, initial and fallback data */
  defaultData,
  /** The current version of the data format - should be a whole number that is only ever incremented */
  formatVersion,
  /**
   * The engine is responsible for the actual data storage.  
   * Certain environments require certain engines, for example BrowserStorageEngine should be used in a DOM environment.  
   * FileStorageEngine will require Node.js or a newer version of Deno with Node compatibility.
   */
  engine: () => new FileStorageEngine({
    // missing directories will be created automatically
    filePath: (id) => `./.data-stores/${id}.dat`,
  }),
  /** Data format migration functions called when the formatVersion is increased */
  migrations,
  /**
   * If the data was saved under different ID(s) before, providing them here will make
   * sure the data is migrated to the current ID when `loadData()` is called
   */
  migrateIds: ["my-data", "config"],

  // Compression example:
  // Adding the following will save space at the cost of a little bit of performance (only for the initial loading and every time new data is saved)
  // Feel free to use your own functions here, as long as they take in the stringified JSON and return another string, either synchronously or asynchronously
  // Either both of these properties or none of them should be set

  /** Compresses the data using the "deflate-raw" algorithm before storing */
  compressionFormat: "deflate-raw",
  // ensure the algorithm always stays the same!
});

/** Entrypoint of the script */
async function init() {
  // wait for the data to be loaded from persistent storage
  // if no data was saved in persistent storage before or getData() is called before loadData(), the value of options.defaultData will be returned
  // if the previously saved data needs to be migrated to a newer version, it will happen inside this function call
  const configData = await manager.loadData();

  console.log(configData.foo); // "hello"

  // update the data
  configData.foo = "world";
  configData.bar = 123;

  // save the updated data - synchronously to the cache and asynchronously to persistent storage
  manager.saveData(configData).then(() => {
    console.log("Data saved to persistent storage!");
  });

  // the internal cache is updated synchronously, so the updated data can be accessed before the Promise resolves:
  console.log(manager.getData().foo); // "world"
}

init();
```
</details>

<br>

### Methods

### `DataStore.loadData()`
Signature:
```ts
loadData(): Promise<TData>;
```
  
Asynchronously loads the data from persistent storage and returns it.  
If no data was saved in persistent storage before, the value of `options.defaultData` will be returned and also written to persistent storage before resolving.  
If the `options.migrateIds` property is present and this is the first time calling this function in this session, the data will be migrated from the old ID(s) to the current one.  
Then, if the `formatVersion` of the saved data is lower than the current one and the `options.migrations` property is present, the instance will try to migrate the data to the latest format before resolving, updating the in-memory cache and persistent storage.  

<br>

### `DataStore.getData()`
Signature:
```ts
getData(): TData;
```
  
Synchronously returns the current data that is stored in the internal cache.  
If no data was loaded from persistent storage yet using `loadData()`, the value of `options.defaultData` will be returned.

<br>

### `DataStore.setData()`
Signature:
```ts
setData(data: TData): Promise<void>;
```
  
Writes the given data synchronously to the internal cache and asynchronously to persistent storage.

<br>

### `DataStore.saveDefaultData()`
Signature:
```ts
saveDefaultData(): Promise<void>;
```
  
Writes the default data given in `options.defaultData` synchronously to the internal cache and asynchronously to persistent storage.

<br>

### `DataStore.deleteData()`
Signature:
```ts
deleteData(): Promise<void>;
```
  
Fully deletes the data from persistent storage only. Also deletes the data container itself, if the storage engine implements the [`deleteStorage()`](#datastoreenginedeletestorage) method.  
The internal cache will be left untouched, so any subsequent calls to `getData()` will return the data that was last loaded.  
If `loadData()` or `setData()` are called after this, the persistent storage will be populated with the value of `options.defaultData` again.  
This is why you should either immediately repopulate the cache and persistent storage or the page should probably be reloaded or closed after this method is called.

<br>

### `DataStore.runMigrations()`
Signature:
```ts
runMigrations(oldData: any, oldFmtVer: number, resetOnError?: boolean): Promise<TData>;
```
  
Runs all necessary migration functions to migrate the given `oldData` to the latest format.  
If `resetOnError` is set to `false`, the migration will be aborted and a [`MigrationError`](#class-migrationerror) is thrown and no data will be committed. If it is set to `true` (default) and an error is encountered, it will be suppressed and the `defaultData` will be saved to persistent storage and returned.

<br>

### `DataStore.migrateId()`
Signature:
```ts
migrateId(oldIds: string | string[]): Promise<void>;
```
  
Tries to migrate the currently saved persistent data from one or more old IDs to the ID set in the constructor.  
If no data exist for the old ID(s), nothing will be done, but some time may still pass trying to fetch the non-existent data.  
Instead of calling this manually, consider setting the `migrateIds` property in the constructor to automatically migrate the data once per session in the call to `loadData()`, unless you know that you need to migrate the ID(s) manually.

<br>

### `DataStore.encodingEnabled()`
Signature:
```ts
encodingEnabled(): boolean;
```
  
Returns `true` if both `options.encodeData` and `options.decodeData` are set, else `false`.  
Uses TypeScript's type guard notation for easier use in conditional statements.

<br><br>

### `type DataStoreOptions`
The options object for the [`DataStore` class.](#class-datastore)  
It has the following properties:
| Property | Type | Description |
| :-- | :-- | :-- |
| `id` | `string` | A unique internal identification string for this instance. If two DataStores share the same ID, they will overwrite each other's data. |
| `defaultData` | `TData` | The default data to use if no data is saved in persistent storage yet. Until the data is loaded from persistent storage, this will be the data returned by `getData()`. For TypeScript, the type of the data passed here is what will be used for all other methods of the instance. |
| `formatVersion` | `number` | An incremental version of the data format. If the format of the data is changed in any way, this number should be incremented, in which case all necessary functions of the migrations dictionary will be run consecutively. *Never decrement this number!* |
| `engine` | [`DataStoreEngine \| () => DataStoreEngine`](#storage-engines) | Either a storage engine instance or a function that creates and returns a new storage engine instance. The engine implements the API used to persist all key-value pairs. See the [Storage Engines section.](#storage-engines) |
| `migrations?` | [`DataMigrationsDict`](#type-datamigrationsdict) | (Optional) A dictionary of functions that can be used to migrate data from older versions of the data to newer ones. The keys of the dictionary should be the format version number that the function migrates to, from the previous whole integer value. The values should be functions that take the data in the old format and return the data in the new format. The functions will be run in order from the oldest to the newest version. If the current format version is not in the dictionary, no migrations will be run. |
| `migrateIds?` | `string \| string[]` | (Optional) A string or array of strings that migrate from one or more old IDs to the ID set in the constructor. If no data exist for the old ID(s), nothing will be done, but some time may still pass trying to fetch the non-existent data. The ID migration will be done once per session in the call to [`loadData()`](#datastoreloaddata). |
| `compressionFormat?` | [`CompressionFormat`](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream/CompressionStream#format) \| `null` | (Optional, disallowed when `encodeData` and `decodeData` are set) The compression format to use when saving the data. If set, the data will be compressed before saving and decompressed after loading. The default is `"deflate-raw"`. Explicitly set to `null` to disable compression. |
| `encodeData?` | `[format: string, encode: (data: string) => string \| Promise<string>]` | (Optional, but required when `decodeData` is also set and disallowed when `compressionFormat` is set) Format identifier and function that encodes the data before saving - you can use [`compress()`](#function-compress) here to save space at the cost of a little bit of performance |
| `decodeData?` | `[format: string, decode: (data: string) => string \| Promise<string>]` | (Optional, but required when `encodeData` is also set and disallowed when `compressionFormat` is set) Format identifier and function that decodes the data when loading - you can use [`decompress()`](#function-decompress) here to decode the data that was previously compressed with [compress()](#function-compress) |

<br>

### `type DataMigrationsDict`
A dictionary of functions that can be used to migrate data from older versions of the data to newer ones.  
  
The keys of the dictionary should be the format version number that the function migrates to, from the previous whole integer value.  
Don't use negative values and don't skip numbers.  
  
The values are functions that take the data in the old format as the sole argument and should return the data in the new format.  
The old data is a copy of the cached object, so you can mutate it directly, use `delete data.foo` to delete properties, etc.

<br>

### `type DataStoreData`
```ts
type DataStoreData<TData extends SerializableVal = SerializableVal> = Record<string, SerializableVal | TData>;
```
  
A type that represents the data stored in a DataStore instance.  
It is a record of string keys to values that can be serialized to JSON via `JSON.stringify()`.  
This means that the values can be primitive types (string, number, boolean, null), arrays or objects that only contain serializable values.  
Refer to the [`SerializableVal` type](#type-serializableval) for more information.

<br><br>

### `class DataStoreSerializer`
Usage:
```ts
const serializer = new DataStoreSerializer(stores: DataStore[], options?: DataStoreSerializerOptions);
```
  
A class that manages serializing and deserializing (exporting and importing) one to infinite DataStore instances.  
The serialized data is a JSON string that can be saved to a file, copied to the clipboard, or stored in any other way.  
Each DataStore instance's settings like data encoding are respected and saved next to the exported data.  
Also, by default a checksum is calculated and importing data with a mismatching checksum will throw an error.  
  
The class' internal methods are all declared as protected, so you can extend this class and override them if you need to add your own functionality.  
  
- ⚠️ Needs to run in a secure context (HTTPS) due to the use of the SubtleCrypto API.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { DataStore, DataStoreSerializer, compress, decompress } from "@sv443-network/coreutils";

/** This store doesn't have migrations to run and also doesn't compress any data */
const fooStore = new DataStore({
  id: "foo-data",
  defaultData: {
    foo: "hello",
  },
  formatVersion: 1,
  engine: new BrowserStorageEngine(),
});

/** This store has migrations to run and also has encodeData and decodeData functions */
const barStore = new DataStore({
  id: "bar-data",
  defaultData: {
    foo: "hello",
  },
  formatVersion: 2,
  engine: new BrowserStorageEngine({
    // this engine will use the localStorage API to store the data
    type: "localStorage",
  }),
  migrations: {
    2: (oldData) => ({
      ...oldData,
      bar: "world",
    }),
  },
  // this is how you can set custom encoding and decoding functions:
  encodeData: ["gzip", (data) => compress(data, "gzip", "string")],
  decodeData: ["gzip", (data) => decompress(data, "gzip", "string")],
  // ensure the algorithm always stays consistent!
});

const serializer = new DataStoreSerializer([fooStore, barStore], {
  addChecksum: true,
  ensureIntegrity: true,
});

async function exportMyDataPls() {
  // first, make sure the persistent data of all stores is loaded into their caches:
  await serializer.loadStoresData();

  // now serialize the data:
  const serializedData = await serializer.serialize();
  // create a file and download it:
  const blob = new Blob([serializedData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `data_export-${new Date().toISOString()}.json`;
  a.click();
  a.remove();

  // `serialize()` exports a stringified object that looks similar to this:
  // [
  //   {
  //     "id": "foo-data",
  //     "data": "{\"foo\":\"hello\"}", // not compressed or encoded because encodeData and decodeData are not set
  //     "formatVersion": 1,
  //     "encoded": false,
  //     "checksum": "420deadbeef69"
  //   },
  //   {
  //     "id": "bar-data",
  //     "data": "eJyrVkrKTFeyUkrOKM1LLy1WqgUAMvAF6g==", // compressed because encodeData and decodeData are set
  //     "formatVersion": 2,
  //     "encoded": true,
  //     "checksum": "69beefdead420"
  //   }
  // ]
}

async function importMyDataPls() {
  // grab the data from the file by using the system file picker or a text field or something similar
  const data = await getDataFromSomewhere();

  try {
    // import the data and run migrations if necessary
    await serializer.deserialize(data);
  }
  catch(err) {
    console.error(err);
    alert(`Data import failed: ${err}`);
  }
}

async function resetMyDataPls() {
  // reset the data of all stores in both the cache and the persistent storage
  await serializer.resetStoresData();
}

async function exportOnlyFoo() {
  // with the `serializePartial()` method, you can export only the data of specific stores:
  const serializedExample1 = await serializer.serializePartial(["foo-data"]);

  // or using a matcher function:
  const serializedExample2 = await serializer.serializePartial((id) => id.startsWith("foo"));
}
```
</details>

<br>

### Methods

### `DataStoreSerializer.serialize()`
Signature:
```ts
serialize(useEncoding?: boolean, stringified?: boolean): Promise<string | SerializedDataStore[]>;
```
  
Serializes all DataStore instances passed in the constructor and returns the serialized data as a JSON string by deafault.  
If `useEncoding` is set to `true` (default), the data will be encoded using the `encodeData` function set on the DataStore instance.  
If `stringified` is set to `true` (default), the serialized data will be returned as a stringified JSON array, otherwise the unencoded objects will be returned in an array.  
  
If you need a partial export, use the method [`DataStoreSerializer.serializePartial()`](#datastoreserializerserializepartial) instead.  
  
<details><summary>Click to view the structure of the returned data.</summary>  

```jsonc
[
  {
    "id": "foo-data",                               // the ID property given to the DataStore instance
    "data": "eJyrVkrKTFeyUkrOKM1LLy1WqgUAMvAF6g==", // serialized data (may be compressed / encoded or not)
    "formatVersion": 2,                             // the format version of the data
    "encoded": true,                                // only set to true if both encodeData and decodeData are set in the DataStore instance
    "checksum": "420deadbeef69",                    // property will be missing if addChecksum is set to false
  },
  {
    "id": "bar-data",
    "data": "{\"foo\":\"hello\",\"bar\":\"world\"}", // for unencoded stores, the data will be a stringified JSON object
    "formatVersion": 1,
    "encoded": false,
    "checksum": "69beefdead420"
  }
]
```
</details>  

<br>

### `DataStoreSerializer.serializePartial()`
Signature:
```ts
serializePartial(stores: string[] | ((id: string) => boolean), useEncoding?: boolean, stringified?: boolean): Promise<string | SerializedDataStore[]>;
```
  
Serializes only the DataStore instances that have an ID that is included in the `stores` array.  
  
The `stores` argument can be an array containing the IDs of the DataStore instances, or a function that takes each ID as an argument and returns a boolean, indicating whether the store should be serialized.  
If `useEncoding` is set to `true` (default), the data will be encoded using the `encodeData` function set on the DataStore instance.  
If `stringified` is set to `true` (default), the serialized data will be returned as a stringified JSON array, otherwise the unencoded objects will be returned in an array.  
  
For more information or to export all DataStore instances, refer to the method [`DataStoreSerializer.serialize()`](#datastoreserializerserialize)

<br>

### `DataStoreSerializer.deserialize()`
Signature:
```ts
deserialize(data: string | SerializedDataStore[]): Promise<void>;
```
  
Deserializes the given string or array of serialized DataStores that was created with `serialize()` or `serializePartial()` and imports the contained data into each matching DataStore instance.  
In the process of importing the data, the migrations will be run, if the `formatVersion` property is lower than the one set on the DataStore instance.  
  
The `data` parameter can be the data as a string or an array of serialized DataStores, as returned by the `serialize()` or `serializePartial()` methods.  
  
If `ensureIntegrity` is set to `true` and the checksum doesn't match, a [`ChecksumMismatchError`](#class-checksummismatcherror) will be thrown.  
If `ensureIntegrity` is set to `false`, the checksum check will be skipped entirely.  
If the `checksum` property is missing on the imported data, the checksum check will also be skipped.  
If `encoded` is set to `true`, the data will be decoded using the `decodeData` function set on the DataStore instance.  
  
For only importing a subset of the serialized data, use the method [`DataStoreSerializer.deserializePartial()`](#datastoreserializerdeserializepartial) instead.

<br>

### `DataStoreSerializer.deserializePartial()`
Signature:
```ts
deserializePartial(stores: string[] | ((id: string) => boolean), data: string | SerializedDataStore[]): Promise<void>;
```
  
Deserializes only the DataStore instances that have an ID that is included in the `stores` array.  
In the process of importing the data, the migrations will be run, if the `formatVersion` property is lower than the one set on the DataStore instance.  
  
The `stores` parameter can be an array containing the IDs of the DataStore instances, or a function that takes each ID as an argument and returns a boolean, indicating whether the store should be deserialized.  
The `data` parameter can be the data as a string or an array of serialized DataStores, as returned by the `serialize()` or `serializePartial()` methods.  
  
If `ensureIntegrity` is set to `true` and the checksum doesn't match, a [`ChecksumMismatchError`](#class-checksummismatcherror) will be thrown.  
If `ensureIntegrity` is set to `false`, the checksum check will be skipped entirely.  
If the `checksum` property is missing on the imported data, the checksum check will also be skipped.  
If `encoded` is set to `true`, the data will be decoded using the `decodeData` function set on the DataStore instance.  
  
If you want to import all serialized data, refer to the method [`DataStoreSerializer.deserialize()`](#datastoreserializerdeserialize)

<br>

### `DataStoreSerializer.loadStoresData()`
Signature:
```ts
loadStoresData(stores?: string[] | ((id: string) => boolean)): PromiseSettledResult<{ id: string, data: object }>[];;
```
  
Loads the persistent data of the DataStore instances with IDs matching the `stores` parameter into the in-memory cache of each DataStore instance.  
If no stores are specified, all stores will be loaded.  
Also triggers the migration process if the data format has changed.  
See the [`DataStore.loadData()`](#datastoreloaddata) method for more information.  
  
<details><summary>Click to view the structure of the returned data.</summary>  

```jsonc
[
  {
    "status": "fulfilled",
    "value": {
      "id": "foo-data",
      "data": {
        "foo": "hello",
        "bar": "world"
      }
    }
  },
  {
    "status": "rejected",
    "reason": "Checksum mismatch for DataStore with ID \"bar-data\"!\nExpected: 69beefdead420\nHas: abcdef42"
  }
]
```

</details>

<br>

### `DataStoreSerializer.resetStoresData()`
Signature:
```ts
resetStoresData(stores?: string[] | ((id: string) => boolean)): PromiseSettledResult[];;
```
  
Resets the persistent data of the DataStore instances with IDs matching the `stores` parameter to their default values.  
If no stores are specified, all stores will be reset.  
This affects both the in-memory cache and the persistent storage.  
Any call to `serialize()` will then use the value of `options.defaultData` of the respective DataStore instance.  

<br>

### `DataStoreSerializer.deleteStoresData()`
Signature:
```ts
deleteStoresData(stores?: string[] | ((id: string) => boolean)): PromiseSettledResult[];;
```
  
Deletes the persistent data of the DataStore instances with IDs matching the `stores` parameter from the set storage method.  
If no stores are specified, all stores' persistent data will be deleted.  
Leaves the in-memory cache of the DataStore instances untouched.  
Any call to `setData()` on the instances will recreate their own persistent storage data.

<br><br>

### `type DataStoreSerializerOptions`
The options object for the [`DataStoreSerializer` class.](#class-datastoreserializer)  
It has the following properties:  
| Property | Type | Description |
| :-- | :-- | :-- |
| `addChecksum?` | `boolean` | (Optional) If set to `true` (default), a SHA-256 checksum will be calculated and saved with the serialized data. If set to `false`, no checksum will be calculated and saved. |
| `ensureIntegrity?` | `boolean` | (Optional) If set to `true` (default), the checksum will be checked when importing data and an error will be thrown if it doesn't match. If set to `false`, the checksum will not be checked and no error will be thrown. If no checksum property exists on the imported data (for example because it wasn't enabled in a previous data format version), the checksum check will be skipped regardless of this setting. |

<br>

### `type LoadStoresDataResult`
```ts
type LoadStoresDataResult = {
  /** The ID of the DataStore instance */
  id: string;
  /** The in-memory data object */
  data: object;
}
```
  
Result of calling [`DataStoreSerializer.loadStoresData()`.](#datastoreserializerloadstoresdata)

<br>

### `type SerializedDataStore`
```ts
type SerializedDataStore = {
  /** The ID of the DataStore instance */
  id: string;
  /** The serialized data */
  data: string;
  /** The format version of the data */
  formatVersion: number;
  /** Whether the data is encoded */
  encoded: boolean;
  /** The checksum of the data - key is not present when `addChecksum` is `false` */
  checksum?: string;
};
```
  
Meta object and serialized data of a [`DataStore` class](#class-datastore) instance.

<br>

### `type StoreFilter`
```ts
type StoreFilter = string[] | ((id: string) => boolean);
```
  
Argument for filtering DataStore instances in the methods [`DataStoreSerializer.serializePartial()`](#datastoreserializerserializepartial) and [`DataStoreSerializer.deserializePartial()`](#datastoreserializerdeserializepartial).

<br><br>

### `class DataStoreEngine`
Signature:
```ts
abstract class DataStoreEngine<TData extends DataStoreData>;
```
  
Usage:
```ts
type MyStorageEngineOptions<TData extends DataStoreData> = {
  dataStoreOptions?: DataStoreEngineDSOptions<TData>;
  // ...
}

class MyStorageEngine<TData extends DataStoreData> extends DataStoreEngine<TData> {
  constructor(protected options: MyStorageEngineOptions<TData>) {
    super(options?.dataStoreOptions);
  }
}
```
  
Base class for storage engines used by the [`DataStore` class.](#class-datastore)  
This architecture allows different engines to be used in different environments, like the frontend or backend.  
While this library offers some premade engines [in the Storage Engines section,](#storage-engines) you can also create your own engine by extending this class and implementing at least the required (abstract) methods (see the example).  
  
<details><summary>Example - click to view</summary>

```ts
import { DataStoreEngine, type DataStoreData, type DataStoreEngineDSOptions } from "@sv443-network/coreutils";

type MyStorageEngineOptions<TData extends DataStoreData> = {
  dataStoreOptions?: DataStoreEngineDSOptions<TData>;
  // custom engine options here:
}

class MyStorageEngine<TData extends DataStoreData> extends DataStoreEngine<TData> {
  protected options: MyStorageEngineOptions<TData>;

  constructor(options: MyStorageEngineOptions<TData>) {
    // if this engine is used standalone, this is how it needs to be initialized, to ensure the "id", "encodeData" and "decodeData" properties are set:
    super(options?.dataStoreOptions);
    this.options = options;
  }

  /** Required - returns the value of the given name from persistent storage, or defaultValue if it doesn't exist */
  async getValue(name: string, defaultValue: string): Promise<string> {
    // implement your own logic in here

    // this.dataStoreOptions will be set by the DataStore instance before any of these methods are called:
    const value = await grabMyValue(`${this.dataStoreOptions.id}-${name}`);
    return value ?? defaultValue;
  }

  /** Required - sets the value of the given name in persistent storage */
  async setValue(name: string, value: string): Promise<void> {
    // implement your own logic in here

    await saveMyValue(`${this.dataStoreOptions.id}-${name}`, value);
  }

  /** Required - deletes the value of the given name from persistent storage */
  async deleteValue(name: string): Promise<void> {
    // implement your own logic in here

    await deleteMyValue(`${this.dataStoreOptions.id}-${name}`);
  }

  /** Optional - deletes the entire storage container, e.g. a file or database */
  async deleteStorage(): Promise<void> {
    // this method is optional, so you can remove it if it doesn't apply to your storage logic

    await deleteMyStorageContainer(this.dataStoreOptions.id);
  }

  // implementing new behavior and use the default implementation as a fallback:

  public deepCopy<T>(obj: T): T {
    try {
      // use your own deep copy logic here
      return myCustomDeepCopy(obj);
    }
    catch {
      // if the custom deep copy fails, fall back to the default implementation:
      return super.deepCopy(obj);
    }
  }

  // other methods that can be overridden (or used as-is):

  // public async serializeData(data: TData, useEncoding?: boolean): Promise<string>;
  // public async deserializeData(data: string, useEncoding?: boolean): Promise<TData>;
  // protected ensureDataStoreOptions(): void;
  // public setDataStoreOptions(dataStoreOptions: DataStoreEngineDSOptions<TData>): void;
}


// using the engine standalone:

const engine = new MyStorageEngine({
  // since there's no DataStore instance to initialize the engine, the dataStoreOptions need to be passed here
  // if they aren't passed, most methods will throw an error
  dataStoreOptions: {
    id: "my-engine",
    encodeData: ["gzip", (data) => compress(data, "gzip", "string")],
    decodeData: ["gzip", (data) => decompress(data, "gzip", "string")],
  },
});

await engine.setValue("foo", "bar");
console.log(await engine.getValue("foo", "default")); // "bar"
await engine.deleteValue("foo");
console.log(await engine.getValue("foo", "default")); // "default"


// using the engine in a DataStore instance:

import { DataStore } from "@sv443-network/coreutils";

const store = new DataStore({
  id: "my-store",
  defaultData: {
    foo: "hello",
  },
  formatVersion: 1,
  engine: new MyStorageEngine({
    // no need to pass dataStoreOptions here, as the DataStore instance will override them automatically using the method `DataStoreEngine.setDataStoreOptions()`
  }),
});

await store.loadData(); // DataStore uses the engine internally for persistent storage
await store.engine.setValue("bar", "baz"); // the store's engine instance can also be used manually (though not really recommended)
```
</details>

<br>

### Methods

### `DataStoreEngine.getValue()`
Signature:
```ts
abstract getValue<TValue extends SerializableVal = string>(name: string, defaultValue: TValue): Promise<string | TValue>;
```
  
Must be implemented by the engine subclass.  
Is called to get the value of the given name from persistent storage.  
If the value doesn't exist, `defaultValue` should be returned.  
The value needs to be deserialized to the correct type in the [`SerializableVal` union](#type-serializableval). This is up to your implementation.

<br>

### `DataStoreEngine.setValue()`
Signature:
```ts
abstract setValue(name: string, value: SerializableVal): Promise<void>;
```
  
Must be implemented by the engine subclass.  
Is called to set the value of the given name in persistent storage.  
The value can be any type in the [`SerializableVal` union](#type-serializableval), so it needs to be safely serialized, so that [`DataStoreEngine.getValue()`](#datastoreenginegetvalue) can deserialize it again.

<br>

### `DataStoreEngine.deleteValue()`
Signature:
```ts
abstract deleteValue(name: string): Promise<void>;
```
  
Must be implemented by the engine subclass.  
Is called to delete the value of the given name from persistent storage.  

<br>

### `DataStoreEngine.deleteStorage()`
Signature:
```ts
deleteStorage?(): Promise<void>;
```
Optional method that may be implemented by the engine subclass. Gets called when the [`DataStore.deleteData()`](#datastoredeletedata) method is called.  
If called, it should delete all data stored by the engine by deleting the storage container itself (e.g. the file or database).

<br>

### `DataStoreEngine.serializeData()`
Signature:
```ts
serializeData(data: TData, useEncoding?: boolean): Promise<string>;
```
  
Is called to serialize the data before it will be saved.  
In the default implementation, if `useEncoding` is set to `true`, the data will be encoded using the function at `dataStoreOptions.encodeData[1]`.

<br>

### `DataStoreEngine.deserializeData()`
Signature:
```ts
deserializeData(data: string, useEncoding?: boolean): Promise<TData>;
```
  
Is called to deserialize the data that was previously serialized with `serializeData()`.  
In the default implementation, if `useEncoding` is set to `true`, the data will be decoded using the `dataStoreOptions.decodeData` function.

<br>

### `DataStoreEngine.deepCopy()`
Signature:
```ts
deepCopy<T>(obj: T): T;
```
  
Creates a deep copy of the given object.  
The default implementation uses the [`structuredClone()` function](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) if available, which is the most efficient way to clone many types of objects.  
If it isn't available, it defaults to a more primitive `JSON.parse(JSON.stringify(obj))` clone.

<br>

### `DataStoreEngine.setDataStoreOptions()`
Signature:
```ts
setDataStoreOptions(dataStoreOptions: DataStoreEngineDSOptions<TData>): void;
```
  
Called by the [`DataStore` constructor](#class-datastore) instance to pass a reduced version of its options object (see also [`DataStoreEngineDSOptions`](#type-datastoreenginedsoptions)).  
If you are using a DataStoreEngine subclass standalone, you can call this method yourself to set the options object.

<br>

### `type DataStoreEngineDSOptions`
```ts
type DataStoreEngineDSOptions<TData extends DataStoreData> =
  Pick<DataStoreOptions<TData>, "decodeData" | "encodeData" | "id">;
```
  
A reduced version of the [`DataStoreOptions`](#type-datastoreoptions) object that is set via the respective [`DataStoreEngine` subclass constructor](#storage-engines), or the method [`DataStoreEngine.setDataStoreOptions()`](#datastoreenginesetdatastoreoptions).  
It contains only the properties necessary for storage engines to function properly:
| Property | Type | Description |
| :-- | :-- | :-- |
| `id` | `string` | The ID of the namespace under which to store the data. This is used to prevent collisions between different "realms". |
| `encodeData` | `[format: string, encode: (data: string) => string \| Promise<string>]` | Format identifier and function that encodes the data before saving - you can use [`compress()`](#function-compress) here to save space at the cost of a little bit of performance |
| `decodeData` | `[format: string, decode: (data: string) => string \| Promise<string>]` | Format identifier and function that decodes the data when loading - you can use [`decompress()`](#function-decompress) here to decode the data that was previously compressed with [compress()](#function-compress) |

<br><br>

<!-- #region DataStoreEngines -->
### Storage Engines

<br>

### `class BrowserStorageEngine`
Signature:
```ts
class BrowserStorageEngine<TData extends DataStoreData>
  extends DataStoreEngine<TData>;
```
  
Usage:
```ts
const engine = new BrowserStorageEngine(options?: BrowserStorageEngineOptions);
```
  
Storage engine for the [`DataStore` class](#class-datastore) that uses the browser's LocalStorage or SessionStorage to store data.  
  
- ⚠️ Requires a secure DOM environment (HTTPS)  
- ⚠️ Don't reuse engines across multiple [`DataStore`](#class-datastore) instances
  
<details><summary>Example - click to view</summary>

```ts
import { DataStore, BrowserStorageEngine } from "@sv443-network/coreutils";

// this DataStore will only work in the browser, because it uses the BrowserStorageEngine
const myStore = new DataStore({
  id: "my-data",
  defaultData: {
    foo: 1,
  },
  formatVersion: 1,
  engine: new BrowserStorageEngine({
    // LocalStorage will persist across sessions, SessionStorage will be cleared when the page is closed
    type: "localStorage", // or "sessionStorage"
  }),
  // ensure the algorithm always stays the same!
  encodeData: (data) => compress(data, "deflate-raw", "string"),
  decodeData: (data) => decompress(data, "deflate-raw", "string"),
});

async function init() {
  // wait for the data to be loaded from the file or for the defaultData to be saved
  const configData = await myStore.loadData();

  console.log(configData.foo); // 1
}

init();
```
</details>

<br>

### `type BrowserStorageEngineOptions`
```ts
type BrowserStorageEngineOptions = {
  /** Whether to store the data in LocalStorage (default) or SessionStorage */
  type?: "localStorage" | "sessionStorage";
};
```
  
Options for the [`BrowserStorageEngine` class.](#class-browserstorageengine)  
  
The `type` option can be set to `"localStorage"` (default) or `"sessionStorage"` to store the data in the respective storage type.  
Note that the session storage will be cleared when the page is closed, while the local storage will persist until it is manually cleared.

<br><br>

### `class FileStorageEngine`
Signature:
```ts
class FileStorageEngine<TData extends DataStoreData>
  extends DataStoreEngine<TData>;
```
  
Usage:
```ts
const engine = new FileStorageEngine(options?: FileStorageEngineOptions);
```
  
Storage engine for the [`DataStore` class](#class-datastore) that uses a file to store data.  
  
- ⚠️ Requires Node.js or Deno with Node compatibility (v1.31+)  
- ⚠️ Don't reuse engines across multiple [`DataStore`](#class-datastore) instances  
  
<details><summary>Example - click to view</summary>

```ts
import { DataStore, FileStorageEngine } from "@sv443-network/coreutils";

// this DataStore will only work in Node.js or Deno with Node compatibility
const myStore = new DataStore({
  id: "my-data",
  defaultData: {
    foo: 1,
  },
  formatVersion: 1,
  engine: new FileStorageEngine({
    // missing directories will be created automatically
    // since the data is encoded, the file contains raw data instead of JSON, so it's saved as .dat:
    filePath: (id) => `./.data/store-${id}.dat`,
  }),
  // ensure the algorithm always stays the same!
  encodeData: (data) => compress(data, "deflate-raw", "string"),
  decodeData: (data) => decompress(data, "deflate-raw", "string"),
});

async function init() {
  // wait for the data to be loaded from the file or for the defaultData to be saved
  const configData = await myStore.loadData();

  console.log(configData.foo); // 1
}

init();
```
</details>

<br>

### `type FileStorageEngineOptions`
```ts
type FileStorageEngineOptions = {
  /** Function that returns a string or a plain string that is the data file path, including name and extension. Defaults to `.ds-${dataStoreID}` */
  filePath?: ((dataStoreID: string) => string) | string;
};
```
  
Options for the [`FileStorageEngine` class.](#class-filestorageengine)  
  
The `filePath` option can be a function that returns a string or a plain string that is the data file path, including name and extension.  
By default, the file will be created as `.ds-${dataStoreID}` in the current working directory.  
Missing directories will be created automatically.  

<br><br>


<!-- #region Debouncer -->
## Debouncer

<br>

### `class Debouncer`
Signature:
```ts
class Debouncer<TFunc extends (...args: any) => any>
  extends NanoEmitter<DebouncerEventMap<TFunc>>;
```
  
Usage:
```ts
const debouncer = new Debouncer(timeout = 200, type: DebouncerType = "immediate");
```
  
Creates a new Debouncer instance.  
This class manages listeners whose calls are debounced, meaning their frequency is limited to a certain time interval.  
For example you might use this in event listeners that fire frequently (like scroll, resize or mousemove events) to avoid performance issues.  
  
If creating a whole class is too much overhead for your use case, you can also use the standalone [`debounce()` function.](#function-debounce)  
It works similarly to other debounce implementations like `_.debounce()` from Lodash.  
  
If `timeout` is not provided, it will default to 200 milliseconds.  
If `type` isn't provided, it will default to `"immediate"`.  
  
The `type` parameter can be set to `"immediate"` (default and recommended) to let the first call through immediately and then queue the following calls until the timeout is over.  
  
If set to `"idle"`, the debouncer will wait until there is a pause of the given timeout length before executing the queued call.  
Note that this might make the calls be queued up for all eternity if there isn't a long enough gap between them.  

See the below diagram for a visual representation of the different types.  
  
<details><summary><b>Diagram - click to view</b></summary>

![Debouncer type diagram](./.github/assets/debounce.png)

</details>

<details><summary>Example - click to view</summary>

```ts
import { Debouncer } from "@sv443-network/coreutils";

const deb = new Debouncer(); // defaults to 200ms and "immediate"

// register a function to be called when the debouncer triggers
deb.addListener(onResize);

window.addEventListener("resize", (evt) => {
  // arguments will be passed along to all registered listeners
  deb.call(evt);
});

function onResize(evt: Event) {
  console.log("Resized to:", window.innerWidth, "x", window.innerHeight);

  // timeout and type can be modified after the fact:
  deb.setTimeout(500);
  deb.setType("idle");
}

// call these from anywhere else to detach the registered listeners:

function removeResizeListener() {
  deb.removeListener(onResize);
}

function removeAllListeners() {
  deb.removeAllListeners();
}

// or using NanoEmitter's event system:

deb.on("call", (...args) => {
  console.log("Debounced call executed with:", args);
});

deb.on("change", (timeout, type) => {
  console.log("Timeout changed to:", timeout);
  console.log("Edge type changed to:", type);
});
```
</details>

<br>

### Events
The Debouncer class inherits from [`NanoEmitter`](#class-nanoemitter), so you can use all of its inherited methods to listen to the following events:
| Event | Arguments | Description |
| :-- | :-- | :-- |
| `call` | `...TArgs[]`, same as `addListener()` and `call()` | Emitted when the debouncer triggers and calls all listener functions, as an event-driven alternative to the callback-based `addListener()` method. |
| `change` | `timeout: number`, `type: "immediate" \| "idle"` | Emitted when the timeout or type settings were changed. |

<br>

### Methods

### `Debouncer.addListener()`
Signature:
```ts
addListener(fn: ((...args: TArgs[]) => void | unknown)): void;
```
  
Adds a listener function that will be called on timeout.  
You can attach as many listeners as you want and they will all be called synchronously in the order they were added.

<br>

### `Debouncer.removeListener()`
Signature:
```ts
removeListener(fn: ((...args: TArgs[]) => void | unknown)): void;
```
  
Removes the listener with the specified function reference.

<br>

### `Debouncer.removeAllListeners()`
Signature:
```ts
removeAllListeners(): void;
```
  
Removes all listeners.

<br>

### `Debouncer.call()`
Signature:
```ts
call(...args: TArgs[]): void;
```
  
Use this to call the debouncer with the specified arguments that will be passed to all listener functions registered with `addListener()`.  
Not every call will trigger the listeners - only when there is no active timeout.  
If the timeout is active, the call will be queued until it either gets overridden by the next call or the timeout is over.

<br>

### `Debouncer.getListeners()`
Signature:
```ts
getListeners(): ((...args: TArgs[]) => void | unknown)[];
```
  
Returns an array of all registered listener functions.

<br>

### `Debouncer.setTimeout()`
Signature:
```ts
setTimeout(timeout: number): void;
```
  
Changes the timeout for the debouncer.

<br>

### `Debouncer.getTimeout()`
Signature:
```ts
getTimeout(): number;
```
  
Returns the current timeout.

<br>

### `Debouncer.isTimeoutActive()`
Signature:
```ts
isTimeoutActive(): boolean;
```
  
Returns `true` if the timeout is currently active, meaning any call to the `call()` method will be queued.

<br>

### `Debouncer.setType()`
Signature:
```ts
setType(type: "immediate" | "idle"): void;
```
  
Changes the edge type for the debouncer.

<br>

### `Debouncer.getType()`
Signature:
```ts
getType(): "immediate" | "idle";
```
  
Returns the current edge type.

<br><br>

### `function debounce()`
Signature:
```ts
debounce<
  TFunc extends ((...args: TArgs[]) => void | unknown),
  TArgs = any,
> (
  fn: TFunc,
  timeout?: number,
  type?: "immediate" | "idle",
): TFunc & { debouncer: Debouncer }
```
  
A standalone function that debounces a given function to prevent it from being executed too often.  
The function will wait for the specified timeout between calls before executing the function.  
This is especially useful when dealing with events that fire rapidly, like "scroll", "resize", "mousemove", etc.  
  
This function works in the same way as the [`Debouncer` class](#class-debouncer), but is a more convenient wrapper for less complex use cases.  
Still, you will have access to the created Debouncer instance via the `debouncer` prop on the returned function should you need it.  
  
If `timeout` is not provided, it will default to 200 milliseconds.  
If `type` isn't provided, it will default to `"immediate"`.  
  
The `type` parameter can be set to `"immediate"` (default and recommended) to let the first call through immediately and then queue the following calls until the timeout is over.  
  
If set to `"idle"`, the debouncer will wait until there is a pause of the given timeout length before executing the queued call.  
Note that this might make the calls be queued up for all eternity if there isn't a long enough gap between them.  

See the below diagram for a visual representation of the different types.  
  
<details><summary><b>Diagram - click to view</b></summary>

![Debouncer type diagram](./.github/assets/debounce.png)

</details>

<details><summary><b>Example - click to view</b></summary>

```ts
import { debounce } from "@sv443-network/coreutils";

// simple example:
window.addEventListener("resize", debounce((evt) => {
  console.log("Resized to:", window.innerWidth, "x", window.innerHeight);
}));

// or if you need access to the Debouncer instance:

function myFunc(iteration: number) {
  // for the edge type "immediate", iteration 0 and 19 will *always* be called
  // this is so you can react immediately and always have the latest data at the end
  console.log(`Call #${iteration} went through!`);
}

// debouncedFunction can be called at very short intervals but will never let calls through twice within 0.5s:
const debouncedFunction = debounce(myFunc, 500);

function increaseTimeout() {
  // instance can be accessed on the function returned by debounce()
  debouncedFunction.debouncer.setTimeout(debouncedFunction.debouncer.getTimeout() + 100);
}

// and now call the function a bunch of times with varying intervals:

let i = 0;
function callFunc() {
  debouncedFunction(i, Date.now());

  i++;
  // call the function 20 times with a random interval between 0 and 1s (weighted towards the lower end):
  if(i < 20)
    setTimeout(callFunc, Math.floor(1000 * Math.pow(Math.random(), 2.5)));
}

// same as with Debouncer, you can use NanoEmitter's event system:

debouncedFunction.debouncer.on("call", (...args) => {
  console.log("Debounced call executed with:", args);
});

debouncedFunction.debouncer.on("change", (timeout, type) => {
  console.log("Timeout changed to:", timeout);
  console.log("Edge type changed to:", type);
});
```

</details>

<br>

### `type DebouncerType`
```ts
type DebouncerType = "immediate" | "idle";
```
The type of edge to use for the debouncer.  
See the diagram below the table for a visual representation of the different types.  

| Type | Description | Pros | Cons |
| :-- | :-- | :-- | :-- |
| `immediate` | Calls the listeners at the very first call ("rising" edge) and queues the latest call until the timeout expires | First call is let through immediately | After all calls stop, the JS engine's event loop will continue to run until the last timeout expires (doesn't really matter on the web, but could cause a process exit delay in Node.js) |
| `idle` | Queues all calls until there are no more calls in the given timeout duration ("falling" edge), and only then executes the very last call | Makes sure there are zero calls in the given `timeoutDuration` before executing the last call | - Calls are always delayed by at least `1 * timeoutDuration`<br>- Calls could get stuck in the queue indefinitely if there is no downtime between calls that is greater than the `timeoutDuration` |

<details><summary><b>Diagram - click to view</b></summary>

![Debouncer type diagram](./.github/assets/debounce.png)

</details>

<br>

### `type DebouncedFunction`
```ts
type DebouncedFunction<TFunc extends (...args: any) => any> =
  & ((...args: Parameters<TFunc>) => ReturnType<TFunc>)
  & { debouncer: Debouncer<TFunc> };
```
  
The debounced function type that is returned by the [`debounce()` function.](#function-debounce)  
This type is a function that resembles the function to debounce, but it has an additional property `debouncer` that contains the Debouncer instance.  

<br>

### `type DebouncerEventMap`
```ts
type DebouncerEventMap<TFunc extends (...args: any) => any> = {
  /** Emitted when the debouncer calls all registered listeners, as a pub-sub alternative */
  call: TFunc;
  /** Emitted when the timeout or edge type is changed after the instance was created */
  change: (timeout: number, type: DebouncerType) => void;
};
```
  
This is the event map for the [`Debouncer` class.](#class-debouncer)

<br><br>


<!-- #region errors -->
## Errors

<br>

### `class DatedError`
Signature:
```ts
class DatedError
  extends Error;
```
  
Base class for all custom error classes of this library.  
Adds a `date` prop set to the time when the error was created.  
  
<details><summary>Example - click to view</summary>

```ts
import { DatedError } from "@sv443-network/coreutils";

const datedErr = new DatedError("This is a dated error!");

// or create your own error classes:

class MyError extends DatedError {
  constructor(message: string) {
    super(message);
    this.name = "MyError";
  }
}

try {
  throw new MyError("This is a custom error!", { cause: datedErr });
}
catch(err) {
  console.error(err);
  // MyError: This is a custom error!
  // Caused by: DatedError: This is a dated error!

  if(err instanceof DatedError)
    console.error("Error created at", err.date);
}
```
</details>

<br>

### `class ChecksumMismatchError`
Signature:
```ts
class ChecksumMismatchError
  extends DatedError
    extends Error;
```
  
Error while validating a checksum.  
This error may be thrown by the [`DataStoreSerializer` class](#class-datastoreserializer) if the imported data's checksum doesn't match its checksum value.  

<br>

### `class MigrationError`
Signature:
```ts
class MigrationError
  extends DatedError
    extends Error;
```
  
Error while migrating data.  
This error may be thrown by [`DataStore.loadData()`](#datastoreloaddata) and [`DataStoreSerializer.loadStoresData()`](#datastoreserializerloadstoresdata) if the imported data's version doesn't match the current version, or there was an error in a migration function.  

<br>

### `class ValidationError`
Signature:
```ts
class ValidationError
  extends DatedError
    extends Error;
```
  
Error while validating data.  
<!-- TODO: -->
<!-- This error may be thrown by the [`TieredCache` constructor](#class-tieredcache) if the options object contain errors. -->

<br><br>


<!-- #region math -->
## Math

<br>

### `function bitSetHas()`
Signature:
```ts
bitSetHas<TType extends number | bigint>(bitSet: TType, checkVal: TType): boolean;
```
  
Checks if a bit is set in a bitset.  
The `bitSet` and `checkVal` arguments can be either a `number` or a `bigint`, but both must be of the same type.  
  
<details><summary>Example - click to view</summary>

```ts
import { bitSetHas } from "@sv443-network/coreutils";

const myBitSet = 0b101010;

const checkFoo = 0b000010;
const checkBar = 0b000001;

const checkBig = 2n;

console.log(bitSetHas(myBitSet, checkFoo)); // true
console.log(bitSetHas(myBitSet, checkBar)); // false

console.log(bitSetHas(BigInt(myBitSet), checkBig)); // true
```
</details>

<br>

### `function clamp()`
Signatures:
```ts
// with min:
clamp(num: number, min: number, max: number): number
// without min:
clamp(num: number, max: number): number
```
  
Clamps a number between a min and max boundary (inclusive).  
If only the `num` and `max` arguments are passed, the `min` boundary will be set to 0.  
  
<details><summary>Example - click to view</summary>

```ts
import { clamp } from "@sv443-network/coreutils";

clamp(7, 0, 10);     // 7
clamp(7, 10);        // 7 (equivalent to the above)
clamp(-1, 10);       // 0
clamp(5, -5, 0);     // 0
clamp(99999, 0, 10); // 10

// use Infinity to clamp without a min or max boundary:
clamp(Number.MAX_SAFE_INTEGER, Infinity);     // 9007199254740991
clamp(Number.MIN_SAFE_INTEGER, -Infinity, 0); // -9007199254740991
```
</details>

<br>

### `function digitCount()`
Signature:
```ts
digitCount(num: number | Stringifiable, withDecimals = true): number
```
  
Calculates and returns the amount of digits in the given number (floating point or integer).  
If it isn't a number already, the value will be converted by being passed to `String()` and then `Number()` before the calculation.  
  
Returns `NaN` if the number is invalid or `Infinity` if the number is too large to be represented as a regular number.  
  
If `withDecimals` is set to false, only the digits before the decimal point will be counted.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { digitCount } from "@sv443-network/coreutils";

// integers:
const int1 = 123;
const int2 = 123456789;
const int3 = "  123456789    ";
const int4 = Number.MAX_SAFE_INTEGER;
const int5 = "a123b456c789d";
const int6 = parseInt("0x123456789abcdef", 16);

digitCount(int1); // 3
digitCount(int2); // 9
digitCount(int3); // 9
digitCount(int4); // 16
digitCount(int5); // NaN (because hex conversion has to be done through parseInt(str, 16)), like below:
digitCount(int6); // 17

// floats:
const float = 123.456789;

digitCount(float);        // 9
digitCount(float, false); // 3
```
</details>

<br>

### `function formatNumber()`
Signature:
```ts
formatNumber(number: number, locale: string, format: NumberFormat): string;
```
  
Formats a number to a string using the given BCP 47 locale identifier and [`NumberFormat`](#type-numberformat).  
  
<details><summary>Example - click to view</summary>

```ts
import { formatNumber } from "@sv443-network/coreutils";

const num = 1234567.89;

console.log(formatNumber(num, "en-US", "long"));  // 1,234,567.89
console.log(formatNumber(num, "de-DE", "long"));  // 1.234.567,89
console.log(formatNumber(num, "hi", "long"));     // 12,34,567.89

console.log(formatNumber(num, "en-US", "short")); // 1.23M
```
</details>

<br>

### `type NumberFormat`
```ts
type NumberFormat = "long" | "short";
```
  
The format identifier for the [`formatNumber()`](#function-formatnumber) function.  
- `long` - Formats the number using the locale's default formatting rules (e.g. `1,234,567.89` in `en-US`).
- `short` - Formats the number using a short format (e.g. `1.23M` in `en-US`).

<br>

### `function mapRange()`
Signatures:
```ts
// with min arguments:
mapRange(value: number, range1min: number, range1max: number, range2min: number, range2max: number): number
// without min arguments:
mapRange(value: number, range1max: number, range2max: number): number
```
  
Maps a number from one range to the spot it would be in another range.  
If only the `max` arguments are passed, the function will set the `min` for both ranges to 0.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { mapRange } from "@sv443-network/coreutils";

mapRange(5, 0, 10, 0, 100); // 50
mapRange(5, 0, 10, 0, 50);  // 25
mapRange(5, 10, 50);        // 25

// to calculate a percentage from arbitrary values, use 0 and 100 as the second range
// for example, if 4 files of a total of 13 were downloaded:
mapRange(4, 0, 13, 0, 100); // 30.76923076923077
```
</details>

<br>

### `function overflowVal()`
Signatures:
```ts
// with min:
overflowVal(value: number, min: number, max: number): number
// without min (defaults to 0):
overflowVal(value: number, max: number): number
```
  
Returns the value of a number that over- and underflows to conform to the given (inclusive) range.  
This differs from the [`clamp()` function](#function-clamp) in that it will wrap the value around at the edges of the range instead of just pinning it to a given boundary.  
  
If only the `max` argument is passed, the `min` will be set to 0.  
  
If the given value is already within the range, it will be returned unchanged.  
If any argument is `NaN`, `Infinity` or `-Infinity`, it will return `NaN`, since those are not real numbers in a mathematical sense.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { overflowVal } from "@sv443-network/coreutils";

overflowVal(5, 0, 10);     // 5
overflowVal(15, 0, 10);    // 4
overflowVal(-5, 0, 10);    // 6
overflowVal(3, 2);         // 0

overflowVal(NaN, 10);      // NaN
overflowVal(Infinity, 10); // NaN
overflowVal(3, Infinity);  // NaN

overflowVal(1, 10, 0);     // throws RangeError
```
</details>

<br>

### `function randRange()`
Signatures:
```ts
// with min:
randRange(min: number, max: number, enhancedEntropy?: boolean): number
// without min:
randRange(max: number, enhancedEntropy?: boolean): number
```
  
Returns a random number between `min` and `max` (inclusive).  
If only one argument is passed, it will be used as the `max` value and `min` will be set to 0.  
  
If `enhancedEntropy` is set to true (false by default), the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) is used for generating the random numbers.  
Note that this makes the function call take longer, but the generated IDs will have a higher entropy.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { randRange } from "@sv443-network/coreutils";

randRange(0, 10);       // 4
randRange(10, 20);      // 17
randRange(10);          // 7
randRange(0, 10, true); // 4 (the devil is in the details)


function benchmark(enhancedEntropy: boolean) {
  const timestamp = Date.now();
  for(let i = 0; i < 100_000; i++)
    randRange(0, 100, enhancedEntropy);
  console.log(`Generated 100k in ${Date.now() - timestamp}ms`)
}

// using Math.random():
benchmark(false); // Generated 100k in 90ms

// using crypto.getRandomValues():
benchmark(true);  // Generated 100k in 461ms

// about a 4-5x slowdown, but the generated numbers are more entropic
```
</details>

<br>

### `function roundFixed()`
Signature:
```ts
roundFixed(num: number, dec: number): number;
```
  
Rounds the given number to the given number of decimal places (doesn't just cut off digits but actually uses `Math.round()`).  
The `dec` argument must be an integer and can even be negative to round to the left of the decimal point.  
  
<details><summary>Example - click to view</summary>

```ts
import { roundFixed } from "@sv443-network/coreutils";

const num = 123.456789;

console.log(roundFixed(num, 2)); // 123.46
console.log(roundFixed(num, 1)); // 123.5
console.log(roundFixed(num, 0)); // 123
console.log(roundFixed(num, -1)); // 120
console.log(roundFixed(num, -2)); // 100
```
</details>

<br>

### `function valsWithin()`
Signature:
```ts
valsWithin(a: number, b: number, dec = 10, withinRange = 0.5): boolean;
```
  
Rounds the given values at the given decimal place, then checks if they are both within the given range (0.5 by default).  
The `a` and `b` arguments must be the two numbers to compare.  
The `dec` parameter is the same as in [`roundFixed()`](#function-roundfixed).  
`withinRange` is the range to add and subtract from the rounded value of `a` to check if `b` is within that range.  
  
<details><summary>Example - click to view</summary>

```ts
import { valsWithin } from "@sv443-network/coreutils";

console.log(valsWithin(3, Math.PI, undefined, 0.15)); // true
console.log(valsWithin(3, Math.PI, 0.1));             // false
```
</details>

<br><br>


<!-- #region misc -->
## Misc

<br>

### `function consumeGen()`
Signature:
```ts
consumeGen(valGen: ValueGen<any>): Promise<any>
```
  
Asynchronously turns a [`ValueGen`](#type-valuegen) into its final value.  
ValueGen allows for tons of flexibility in how the value can be obtained. Calling this function will resolve the final value, no matter in what form it was passed.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { consumeGen, type ValueGen } from "@sv443-network/coreutils";

async function useValue(value: ValueGen<number>) {
  // type gets inferred as `number` because `value` is typed as a `ValueGen<number>` above
  const finalValue = await consumeGen(value);
  console.log(finalValue);
}

// the following are all valid and yield 42:
useValue(42);
useValue(() => 42);
useValue(Promise.resolve(42));
useValue(async () => 42);

// throws a TS error:
useValue("foo");
```
</details>

<br>

### `type ValueGen`
```ts
type ValueGen<TValueType> = TValueType | Promise<TValueType> | (() => TValueType | Promise<TValueType>);
```
  
Describes a value that can be obtained in various ways, including via the type itself, a function that returns the type, a Promise that resolves to the type or either a sync or an async function that returns the type.  
Use it in the [`consumeGen()` function](#function-consumegen) to convert the given ValueGen value to the type it represents. Also refer to that function for an example.  

<br>

### `function consumeStringGen()`
Signature:
```ts
consumeStringGen(strGen: StringGen): Promise<string>
```
  
Asynchronously turns a [`StringGen`](#type-stringgen) into its final string value.  
StringGen allows for tons of flexibility in how the string can be obtained. Calling this function will resolve the final string.  
Optionally you can use the template parameter to define the union of strings that the StringGen should yield.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { consumeStringGen, type StringGen } from "@sv443-network/coreutils";

export class MyTextPromptThing {
  // full flexibility on how the string can be passed to the constructor,
  // because it can be obtained synchronously or asynchronously,
  // in string or function form:
  constructor(private text: StringGen) {}

  /** Shows the prompt dialog */
  public async showPrompt() {
    const promptText = await consumeStringGen(this.text);
    const promptHtml = promptText.trim().replace(/\n/gm, "<br>");

    // ...
  }
}

// all valid:
const myText = "Hello, World!";
new MyTextPromptThing(myText);
new MyTextPromptThing(() => myText);
new MyTextPromptThing(Promise.resolve(myText));
new MyTextPromptThing(async () => myText);

// throws a TS error:
new MyTextPromptThing(420);
```
</details>

<br>

### `type StringGen`
```ts
type StringGen = ValueGen<Stringifiable>;
```
  
Describes a string that can be obtained in various ways, including via a [`Stringifiable`](#type-stringifiable) value, a function that returns a [`Stringifiable`](#type-stringifiable) value, a Promise that resolves to a [`Stringifiable`](#type-stringifiable) value or either a sync or an async function that returns a [`Stringifiable`](#type-stringifiable) value.  
Remember that [`Stringifiable`](#type-stringifiable) is a type that describes a value that either is a string itself or can be converted to a string implicitly using `toString()`, template literal interpolation, or by passing it to `String()`, giving you the utmost flexibility in how the string can be passed.  
  
Contrary to [`ValueGen`](#type-valuegen), this type allows for specifying a union of strings that the StringGen should yield, as long as it is loosely typed as just `string`.  
Use it in the [`consumeStringGen()` function](#function-consumestringgen) to convert the given StringGen value to a plain string. Also refer to that function for an example.

<br>

### `function fetchAdvanced()`
Signature:
```ts
fetchAdvanced(input: string | Request | URL, options?: {
  timeout?: number,
  // any other options from fetch()
}): Promise<Response>
```
  
A drop-in replacement for the native `fetch()` function that adds a timeout property.  
The timeout will default to 10 seconds if left undefined. Set it to a negative number to disable the timeout.  
Pass an [AbortController's signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) to the `signal` property to be able to abort the request manually in addition to the automatic timeout.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { fetchAdvanced } from "@sv443-network/coreutils";

const controller = new AbortController();

fetchAdvanced("https://jokeapi.dev/joke/Any?safe-mode&format=json", {
  // times out after 5 seconds:
  timeout: 5000,
  // also accepts any other fetch options like headers and signal:
  headers: {
    "Accept": "application/json",
  },
  // make the request manually abortable:
  signal: controller.signal,
}).then(async (response) => {
  console.log("Fetch data:", await response.json());
}).catch((err) => {
  console.error("Fetch error:", err);
});

// can also be aborted manually before the timeout is reached:
document.querySelector("button#cancel")?.addEventListener("click", () => {
  controller.abort();
});
```
</details>

<br>

### `type FetchAdvancedOpts`
```ts
type FetchAdvancedOpts = RequestInit & {
  timeout?: number;
};
```
  
The options object for the [`fetchAdvanced()` function.](#function-fetchadvanced)  

<br>

### `function getListLength()`
Signature:
```ts
getListLength(obj: ListWithLength, zeroOnInvalid?: boolean): number
```
  
Returns the length of the given list-like object (anything with a numeric `length`, `size` or `count` property, like an array, Map or NodeList).  
Refer to the [`ListWithLength` type](#type-listwithlength) for more info.  
  
If the object doesn't have any of these properties, it will return 0 by default.  
Set `zeroOnInvalid` to false to return NaN instead of 0 if the object doesn't have any of the properties.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { getListLength } from "@sv443-network/coreutils";

getListLength([1, 2, 3]); // 3
getListLength("Hello, World!"); // 13
getListLength(document.querySelectorAll("body")); // 1
getListLength(new Map([["foo", "bar"], ["baz", "qux"]])); // 2
getListLength({ size: 42 }); // 42

// returns 0 by default:
getListLength({ foo: "bar" }); // 0

// can return NaN instead:
getListLength({ foo: "bar" }, false); // NaN
```
</details>

<br>

### `type ListLike`
```ts
type ListLike = unknown[] | { length: number } | { count: number } | { size: number };
```
  
Represents a value that is either an array, NodeList, or any other object that has a numeric `length`, `count` or `size` property.  
Iterables are not included because they don't have a quantifiable length property. They need to be converted to an array first using `Array.from()` or `[...iterable]`.  

<br>

### `function pauseFor()`
Signature:
```ts
pauseFor(time: number, abortSignal?: AbortSignal, rejectOnAbort?: boolean): Promise<void>
```
  
Pauses async execution for a given amount of time.  
If an [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) is passed, the pause will be cut short when the signal is aborted.  
By default, this will resolve the promise, but you can set `rejectOnAbort` to true to reject it instead.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { pauseFor } from "@sv443-network/coreutils";

async function run() {
  console.log("Hello");

  await pauseFor(3000); // waits for 3 seconds

  console.log("World");


  // can also be cut short manually:

  const controller = new AbortController();
  setTimeout(() => controller.abort(), 1000);

  await pauseFor(2_147_483_647, controller.signal); // (maximum possible timeout)

  console.log("This gets printed after just 1 second");
}
```
</details>

<br>

### `function pureObj()`
Signature:
```ts
pureObj<TObj extends object>(obj?: TObj): TObj
```
  
Turns the passed object into a "pure" object without a prototype chain, meaning it won't have any default properties like `toString`, `__proto__`, `__defineGetter__`, etc.  
This could be useful to prevent prototype pollution attacks or to clean up object literals, at the cost of being harder to work with in some cases.  
Returns an empty, pure object if no object is passed.  
It also effectively transforms a [`Stringifiable`](#type-stringifiable) value into one that will throw a TypeError when stringified instead of defaulting to `[object Object]`  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { pureObj } from "@sv443-network/coreutils";

const impureObj = { foo: "bar" };

console.log(impureObj.toString);         // [Function: toString]
console.log(impureObj.__proto__);        // { ... }
console.log(impureObj.__defineGetter__); // [Function: __defineGetter__]
console.log(`${impureObj}`);             // "[object Object]"

const pureObj = pureObj(impureObj);

console.log(pureObj.toString);         // undefined
console.log(pureObj.__proto__);        // undefined
console.log(pureObj.__defineGetter__); // undefined
// @ts-expect-error
console.log(`${pureObj}`);             // TypeError: Cannot convert object to string

const emptyObj = pureObj();

console.log(emptyObj);          // {}
console.log(emptyObj.toString); // undefined
```
</details>

<br>

### `function setImmediateInterval`
Signature:
```ts
function setImmediateInterval(
  callback: () => void | unknown,
  interval: number,
  signal?: AbortSignal,
): void;
```
  
Works similarly to `setInterval()`, but the callback is also called immediately and can be aborted by passing an [`AbortSignal`.](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)  
Uses `setInterval()` internally, which might cause overlapping calls if the callback's synchronous execution takes longer than the given interval time.  
This function will prevent skewing the interval time, contrary to [`setImmediateTimeoutLoop()`.](#function-setimmediatetimeoutloop)  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { setImmediateInterval } from "@sv443-network/coreutils";

const controller = new AbortController();

setImmediateInterval(() => {
  console.log("Hello, World!");
}, 1000, controller.signal);

abortButton.addEventListener("click", () => {
  // abort the interval:
  controller.abort();
});
```
</details>

<br>

### `function setImmediateTimeoutLoop`
Signature:
```ts
function setImmediateTimeoutLoop(
  callback: () => void | unknown,
  interval: number,
  signal?: AbortSignal,
): void;
```
  
Works similarly to a recursive `setTimeout()` loop, but the callback is also called immediately and can be aborted by passing an [`AbortSignal`.](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)  
Uses `setTimeout()` internally to avoid overlapping calls, though this will skew the given interval time by however long the callback takes to execute synchronously.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { setImmediateTimeoutLoop } from "@sv443-network/coreutils";

const controller = new AbortController();

setImmediateTimeoutLoop(() => {
  console.log("Hello, World!");
}, 1000, controller.signal);

abortButton.addEventListener("click", () => {
  // abort the timeout loop:
  controller.abort();
});
```
</details>

<br>

### `function scheduleExit()`
Signature:
```ts
function scheduleExit(code?: number, timeout?: number): void;
```
  
Schedules the process to exit with the given exit code after a timeout, in both Node.js and Deno, but not in the browser.  
This is useful for allowing the currently queued microtasks to finish before exiting the process. This can prevent data loss or corruption when writing to files or databases, for example.  
If no exit code is given, it will default to 0 (success). Set it to 1 to indicate an error.  
If no timeout is given, the process will exit immediately after the current microtask queue is cleared (0ms).  
If a timeout is given, the process will exit after the timeout has elapsed, regardless of whether there are still microtasks in the queue.  

<br><br>


<!--- #region NanoEmitter -->
## NanoEmitter

<br>

### `class NanoEmitter`
Usage:
```ts
// functional:
const emitter = new NanoEmitter<TEventMap = EventsMap>(options?: NanoEmitterOptions);
// object-oriented:
class MyClass extends NanoEmitter<TEventMap = EventsMap> {
  constructor() {
    super(options?: NanoEmitterOptions);
  }
}
```
  
A class that provides a minimalistic event emitter with a tiny footprint powered by [the nanoevents library.](https://npmjs.com/package/nanoevents)  
  
The main intention behind this class is to extend it in your own classes to provide a simple event system directly built into the class.  
However in a functional environment you can also just create instances for use as standalone event emitters throughout your project.  
  
For the options object, refer to the [`NanoEmitterOptions` type.](#type-nanoemitteroptions)  
  
The `TEventMap` generic is used to define the events that can be emitted and listened to.  
It is an object where keys are the event names and values are the listener function types.  
The arguments of the function are the arguments that will be passed to the listener when the event is emitted. The function should always return `void`.  
  
<details><summary><b>Object oriented example - click to view</b></summary>

```ts
import { NanoEmitter } from "@sv443-network/coreutils";

// map of events for strong typing - the functions always return void
interface MyEventMap {
  foo: (bar: string) => void;
  baz: (qux: number) => void;
}

class MyClass extends NanoEmitter<MyEventMap> {
  constructor() {
    super({
      // allow emitting events from outside the class body:
      publicEmit: true,
    });

    // the class can also listen to its own events:
    this.once("baz", (qux) => {
      console.log("baz event (inside, once):", qux);
    });
  }

  public doStuff() {
    // any call to the public emit() method, even when inside the own class, won't work if publicEmit is set to false:
    this.emit("foo", "hello");
    this.emit("baz", 42);
    this.emit("foo", "world");
    // this one will always work when used inside the class and functions identically:
    this.events.emit("baz", 69);
  }
}

const myInstance = new MyClass();
myInstance.doStuff();

// listeners attached with on() can be called multiple times:
myInstance.on("foo", (bar) => {
  console.log("foo event (outside):", bar);
});

// throws a TS error since `events` is protected, but technically still works in JS:
myInstance.events.emit("foo", "hello");

// only works because publicEmit is set to true:
myInstance.emit("baz", "hello from the outside");

// remove all listeners:
myInstance.unsubscribeAll();
```
</details>

<br>

<details><summary><b>Functional example - click to view</b></summary>

```ts
import { NanoEmitter } from "@sv443-network/coreutils";

// map of events for strong typing - the functions always return void
interface MyEventMap {
  foo: (bar: string) => void;
  baz: (qux: number) => void;
}

const myEmitter = new NanoEmitter<MyEventMap>({
  // very important for functional usage - allow emitting events from outside the class body:
  publicEmit: true,
});

myEmitter.on("foo", (bar) => {
  console.log("foo event:", bar);
});

myEmitter.once("baz", (qux) => {
  console.log("baz event (once):", qux);
});

function doStuff() {
  // only works if publicEmit is set to true
  myEmitter.emit("foo", "hello");
  myEmitter.emit("baz", 42);
  myEmitter.emit("foo", "world");
  myEmitter.emit("baz", 69);

  myEmitter.emit("foo", "hello from the outside");

  myEmitter.unsubscribeAll();
}

doStuff();
```
</details>

<br>
  
### Methods

### `NanoEmitter.on()`  
Signature:
```ts
NanoEmitter.on<K extends keyof TEventMap>(event: K, listener: TEventMap[K]): () => void
```
  
Registers a listener function for the given event.  
May be called multiple times for the same event.  
  
Returns a function that can be called to unsubscribe the listener from the event.
  
<br>

### `NanoEmitter.once()`
Signature:
```ts
NanoEmitter.once<K extends keyof TEventMap>(event: K, listener: TEventMap[K]): () => void
```
  
Registers a listener function for the given event that will only be called once.  
  
Returns a function that can be called to unsubscribe the listener from the event.

<br>

### `NanoEmitter.onMulti()`
Signature:
```ts
NanoEmitter.onMulti(options: NanoEmitterOnMultiOptions<TEventMap> | Array<NanoEmitterOnMultiOptions<TEventMap>>): () => void
```
  
Allows subscribing to multiple events and calling the callback only when one of, all of, or a subset of the events are emitted, either continuously or only once.  
  
Returns a function that can be called to unsubscribe all listeners created by this call.  
Alternatively, pass the same [`AbortController`'s `AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController#instance_properties) to all options objects to achieve the same effect, or use different ones for finer control.  
  
The `options` argument can be a single object or an array of objects with the following properties:
| Property | Type | Description |
| :-- | :-- | :-- |
| `callback` | `function` | The function that will be called when the conditions are met. It will be called with the event name and spread arguments that have been passed via the `emit()` method. |
| `oneOf?` | `Array<keyof TEventMap>` | If used, the callback will be called when any of the matching events are emitted. At least one of `oneOf` or `allOf` must be provided. If both are used, it works like an "or" condition. |
| `allOf?` | `Array<keyof TEventMap>` | If used, the callback will be called after all of the matching events are emitted at least once, and, if `once` is false, any time any of them are emitted again. At least one of `oneOf` or `allOf` must be provided. If both are used, it works like an "or" condition. |
| `once?` | `boolean` | If set to true, the callback will be called only once for the first event (or set of events) that match the criteria, then stop listening. Defaults to false. |
| `signal?` | `AbortSignal` | If provided, the subscription will be aborted when the given signal is aborted. |

<details><summary><b>Example - click to view</b></summary>

```ts
import { NanoEmitter } from "@sv443-network/coreutils";

let result = 0;

const myEmitter = new NanoEmitter<{
  foo: (value: number) => void;
  bar: (value: number) => void;
  baz: (value: number) => void;
}>({ publicEmit: true });

myEmitter.onMulti([
  {
    oneOf: ["foo", "bar"],
    // this callback will be called every time either foo or bar is emitted:
    callback: (event, value) => {
      console.log(`Event ${event} emitted with value ${value}`);
      result += value;
    },
  },
  {
    allOf: ["foo", "bar"],
    once: true,
    callback: () => {
      console.log("Both foo and bar were emitted at least once");
      result *= 2;
    },
  },
]);

// the first events add their values to the result:
myEmitter.emit("foo", 10); // "Event foo emitted with value 10" (result = 10)
myEmitter.emit("foo", 20); // "Event foo emitted with value 20" (result = 30)
myEmitter.emit("bar", 30); // "Event bar emitted with value 30" (result = 60)

// both events were emitted at least once, so the second callback is called to multiply the result by 2:
console.log(result); // 120

// any subsequent events will not call the second callback again (because once = true), but will still call the first one:
myEmitter.emit("bar", 10); // "Event bar emitted with value 10"
console.log(result); // 130


// combining allOf and oneOf:

result = 0; // reset result

const controller = new AbortController();

myEmitter.onMulti({
  // using both makes them work like an "or" condition:
  oneOf: ["foo", "bar"],
  allOf: ["bar", "baz"],
  callback: (event, value) => {
    console.log(`Event ${event} emitted with value ${value}`);
    result += value;
  },
  // calling controller.abort() will unsubscribe all listeners created by this call:
  signal: controller.signal,
});

myEmitter.emit("baz", 10); // doesn't match `oneOf` or `allOf`, so nothing happens
console.log(result); // 0

myEmitter.emit("foo", 20); // matches `oneOf`
console.log(result); // 20

myEmitter.emit("bar", 30); // matches `oneOf` and `allOf`
console.log(result); // 50
```
</details>

<br>

### `NanoEmitter.emit()`
Signature:
```ts
NanoEmitter.emit<K extends keyof TEventMap>(event: K, ...args: Parameters<TEventMap[K]>): boolean
```
  
Emits an event with the given arguments from outside the class instance if `publicEmit` is set to `true`.  
If `publicEmit` is set to `true`, this method will return `true` if the event was emitted.  
If it is set to `false`, it will always return `false` and you will need to use `this.events.emit()` from inside the class instead.

<br>

### `NanoEmitter.unsubscribeAll()`
Signature:
```ts
NanoEmitter.unsubscribeAll(): void
```
  
Removes all listeners from all events.

<br><br>

### `type NanoEmitterOptions`
The options object for the [`NanoEmitter` class.](#class-nanoemitter)  
It can have the following properties:
| Property | Type | Description |
| :-- | :-- | :-- |
| `publicEmit?` | `boolean` | If set to true, the public method `emit()` will be callable. False by default. |

<br><br>


<!-- #region text -->
## Text

<br>

### `function autoPlural()`
Signature:
```ts
autoPlural(term: Stringifiable, num: number | ListLike, pluralType: "auto" | "-s" | "-ies" = "auto"): string;
```
  
Turns the given [`Stringifiable`](#type-stringifiable) term that's in singular form into its plural form, depending on the given number.  
The `num` argument can be a number or a quantifiable [`ListLike` value](#type-listlike).  
By default, the plural form will be determined automatically, but you can also manually force it to be `-s` or `-ies`.  
  
<details><summary>Example - click to view</summary>

```ts
import { Collection } from "discord.js";
import { autoPlural } from "@sv443-network/coreutils";

autoPlural("red apple", 0); // "red apples"
autoPlural("red apple", 1); // "red apple"
autoPlural("red apple", 2); // "red apples"

// The default `pluralType` ("auto") switches suffix when the word ends with y:
autoPlural("category", 1); // "category"
autoPlural("category", 2); // "categories"

// Stringifiable objects are also accepted:
autoPlural({ toString: () => "category" }, 2); // "categories"
autoPlural(new Map<unknown, unknown>(), 2);    // "[object Map]s"

// The passed `num` object just needs to have a numeric length, count or size property:
const collection = new Collection<string, string>();
collection.set("foo", "bar");
console.log(collection.size, autoPlural("item", collection)); // "1 item"

const items = [1, 2, 3, 4, "foo", "bar"];
console.log(items.length, autoPlural("item", items)); // "6 items"

// And you can also force pluralization with one or the other if needed:
autoPlural("category", 1, "-s"); // "category"
autoPlural("category", 2, "-s"); // "categorys"
autoPlural("apple", 1, "-ies");  // "apply"
autoPlural("apple", 2, "-ies");  // "applies"
```
</details>

<br>

### `function capitalize()`
Signature:
```ts
capitalize(text: string): string;
```
  
Capitalizes the first letter of the given string.  
  
<details><summary>Example - click to view</summary>

```ts
import { capitalize } from "@sv443-network/coreutils";

console.log(capitalize("hello, world!")); // "Hello, world!"
```
</details>

<br>

### `function createProgressBar()`
Signature:
```ts
createProgressBar(percentage: number, barLength: number, chars: ProgressBarChars = defaultPbChars): string;
```
  
Creats a progress bar string with the given percentage and length.  
The `percentage` argument must be a number between 0 and 100.  
Use `chars` to modify the characters used in the progress bar. By default, [`defaultPbChars`](#const-defaultpbchars) will be used.  
  
<details><summary>Example - click to view</summary>

```ts
import { createProgressBar, defaultPbChars } from "@sv443-network/coreutils";

console.log(createProgressBar(0, 10));   // ──────────
console.log(createProgressBar(25, 10));  // ██▓───────
console.log(createProgressBar(30, 10));  // ███▓──────
console.log(createProgressBar(99, 10));  // █████████▓
console.log(createProgressBar(100, 10)); // ██████████

// overwrite the 0% character:
const customChars = {
  ...defaultPbChars,
  0: "•",
};
console.log(createProgressBar(50, 4, customChars)); // ██••
```
</details>

<br>

#### `const defaultPbChars`
This object contains the default characters for the progress bar.  
It is of type [`ProgressBarChars`](#type-progressbarchars) and contains the following properties:
| Property | Value |
| :-- | :-- |
| `defaultPbChars[100]` | `█` |
| `defaultPbChars[75]` | `▓` |
| `defaultPbChars[50]` | `▒` |
| `defaultPbChars[25]` | `░` |
| `defaultPbChars[0]` | `─` |

<br>

#### `type ProgressBarChars`
Signature:
```ts
type ProgressBarChars = Record<100 | 75 | 50 | 25 | 0, string>;
```
  
This type defines the characters used in the function [`createProgressBar()`](#function-createprogressbar).  
Each property is a number that represents the percentage of each segment of the progress bar.  
So a progress bar with a length of 2 and value of 25% would be represented by the characters `50` and `0`.  

<br>

### `function joinArrayReadable()`
Signature:
```ts
joinArrayReadable(array: unknown[], separators = ", ", lastSeparator = " and "): string;
```
  
Joins the given array into a string, using the given separators.  
Allows for choosing a different separator for the last element.  
  
<details><summary>Example - click to view</summary>

```ts
import { joinArrayReadable } from "@sv443-network/coreutils";

const arr = ["foo", "bar", "baz"];
console.log(joinArrayReadable(arr)); // foo, bar, and baz
```
</details>

<br>

### `function secsToTimeStr()`
Signature:
```ts
secsToTimeStr(seconds: number): string;
```
  
Turns the given number of seconds into a string in the format `(hh:)mm:ss` with intelligent zero-padding.  
  
<details><summary>Example - click to view</summary>

```ts
import { secsToTimeStr } from "@sv443-network/coreutils";

console.log(secsToTimeStr(0));    // 0:0
console.log(secsToTimeStr(1));    // 0:01
console.log(secsToTimeStr(10));   // 0:10
console.log(secsToTimeStr(59));   // 0:59
console.log(secsToTimeStr(60));   // 01:00
console.log(secsToTimeStr(61));   // 01:01
console.log(secsToTimeStr(599));  // 09:59
console.log(secsToTimeStr(600));  // 10:00
console.log(secsToTimeStr(601));  // 10:01
console.log(secsToTimeStr(3599)); // 59:59
console.log(secsToTimeStr(3600)); // 1:00:00
console.log(secsToTimeStr(3601)); // 1:00:01

// @ts-expect-error
secsToTimeStr(-1); // TypeError: Seconds must be a positive number
```
</details>

<br>

### `function truncStr()`
Signature:
```ts
truncStr(input: Stringifiable, length: number, endStr = "..."): string;
```
  
Truncates the given [`Stringifiable` value](#type-stringifiable) to the given length.  
Replaces the last `n` characters with the given `endStr` string, where `n` is the length of the `endStr` string.  
The result is a string that is at most `length` characters long, either by itself, or including the `endStr` string.  
  
<details><summary>Example - click to view</summary>

```ts
import { truncStr } from "@sv443-network/coreutils";

const str = "Lorem ipsum dolor sit amet.";

// use ellipsis (\dots) character to save space:
console.log(truncStr(str, 10, "…")); // "Lorem ips…"
```
</details>

<br><br>


<!-- #region TieredCache -->
<!-- ## TODO: TieredCache

<br>

### `class TieredCache`
Signature:
```ts
class TieredCache<TData extends object>
  extends NanoEmitter<TieredCacheEventMap>;
```
  
Usage:
```ts
const cache = new TieredCache<TDataType>(options: TieredCacheOptions);
```
  
A class that provides a cache system with multiple tiers and persistent storage, allowing for different [storage engines](#storage-engines) and configurations for each tier.  
Most recently used entries are kept in the highest tiers, while the least recently used entries are moved to lower tiers.
  
The class is built on top of the [`DataStore` class](#class-datastore), which provides the persistent storage for each cache tier.  
  
It inherits from [`NanoEmitter`](#class-nanoemitter), so you can listen to events emitted by the class.  
Refer to the [`TieredCacheEventMap` type](#type-tieredcacheeventmap) for a list of events that can be emitted.
  
<details><summary><b>Example - click to view</b></summary>

```ts
import { TieredCache, FileStorageEngine } from "@sv443-network/coreutils";

const myCache = new TieredCache({
  // (required) unique ID for the cache, used for persistent storage
  // must be unique across all TieredCache `engine` instances of the same type:
  id: "my-tiered-cache",
  // (required) cache tier configuration:
  tiers: [
    // L0 cache:
    // data for tier L0 is only kept in memory because no engine prop is set:
    {
      // use gzip compression for the persistent storage, to exchange speed for file size:
      compressionFormat: "gzip",
      // options for when an entry goes stale:
      staleOptions: {
        method: "relevance", // least accessed and oldest entries are marked as stale first
        ttl: 60 * 30,  // 30 minutes
        amount: 50,    // only cache up to 50 entries
        sendToTier: 1, // send to L1 cache when stale
      },
      // which tiers to propagate entries and entry metadata to:
      propagateTiers: [
        {
          index: 1,
          created: true,
          updated: true,
          deleted: true,
          // don't update the accessed timestamp in L1, so its entries get marked as stale more frequently:
          accessed: false,
        },
      ],
    },
    // L1 cache:
    {
      // DataStoreEngine instance for persisting this tier's data:
      engine: new FileStorageEngine({
        filePath: (id) => `./.cache/${id}.dat`,
      }),
    },
  ],
  nanoEmitterOptions: {
    // allow using the public emit() method:
    publicEmit: true,
  },
});

// TODO:
```
</details>

<br>

### Methods

<br>

### `type TieredCacheEventMap`
All events that can be emitted by the [`TieredCache` class.](#class-tieredcache)  

<br>

### `type TieredCacheOptions`
Options object for the [`TieredCache` class.](#class-tieredcache)  
It can have the following properties:
| Property | Type | Description |
| :-- | :-- | :-- |
| `id` | `string` | ID of the cache used in persistent storage, unique per each type of [`DataStoreEngine`](#storage-engines). |
| `tiers` | [`TieredCacheTierOptions[]`](#type-tieredcachetieroptions) | Array of options objects to configure each cache tier. |

<br>

### `type TieredCachePropagateTierOptions`
Options for entry propagation to a specific cache tier.  
This type is a constituent part of the [`TieredCacheTierOptions`](#type-tieredcachetieroptions) type.  
It can have the following properties:
| Property | Type | Description |
| :-- | :-- | :-- |
| `index` | `number` | The index of the cache tier to propagate the entry to. Use negative numbers for accessing from the end, just like `Array.prototype.at()`. Use `1` for the second tier, use `-1` for the last. |
| `created?` | `boolean` | Whether to propagate created entries to the cache with this index. Defaults to true. |
| `updated?` | `boolean` | Whether to propagate updated entries to the cache with this index. Defaults to true. |
| `deleted?` | `boolean` | Whether to propagate deleted entries to the cache with this index. Defaults to true. |
| `accessed?` | `boolean` | Whether to propagate accessed entries to the cache with this index. Defaults to true. |

<br>

### `type TieredCacheStaleOptions`
Options for when an entry goes stale, making it move to a lower tier or get fully deleted.  
This type is a constituent part of the [`TieredCacheTierOptions`](#type-tieredcachetieroptions) type.  
It can have the following properties:
| Property | Type | Description |
| :-- | :-- | :-- |
| `method?` | `"relevance" \| "recency" \| "frequency"` | The method to use for determining which entries are stale. `recency` = least recently used, `frequency` = least frequently used, `relevance` = combination of both (default). |
| `ttl?` | `number` | Maximum time to live for the data in this tier in seconds. |
| `amount?` | `number` | Maximum amount of entries to keep in this tier. |
| `sendToTier?` | `number` | The index of the cache tier to send the entry to when it goes stale. Defaults to the next available tier, or deletes the entry if there is none. |

<br>

### `type TieredCacheTierOptions`
Options object for each cache tier.  
It can have the following properties:
| Property | Type | Description |
| :-- | :-- | :-- |
| `storeOptions?` | [`DataStoreOptions`](#type-datastoreoptions) | Options for the DataStore instance, minus `id` property, used for persisting this tier's data. If none is specified, data is only kept in volatile memory. |
| `memCache?` | `boolean` | Whether to cache the data in memory. Defaults to false. |
| `compressionFormat?` | [`CompressionFormat`](#type-compressionformat) | Which compression format to use for this tier's persistent storage. Defaults to `deflate-raw` - set to `null` to disable compression. |
| `staleOptions?` | [`StaleOptions`](#type-tieredcachestaleoptions) | Options for when an entry goes stale, making it move to a lower tier or get fully deleted. |
| `propagateTiers?` | [`TieredCachePropagateTierOptions[]`](#type-tieredcachepropagatetieroptions) | To which tiers to propagate created and updated entries. Defaults to the next tier in line, with all properties set to their defaults. |

<br><br> -->


<!-- #region types -->

## Types

<br>

### `type LooseUnion`
```ts
type LooseUnion<TUnion extends string | number | object> = TUnion | (
  TUnion extends string
    ? (string & {})
    : (
      TUnion extends number
        ? (number & {})
        : (
          TUnion extends Record<keyof any, unknown>
            ? (object & {})
            : never
        )
    )
);
```
  
Describes a union of `string`s, `number`s or `object`s that can be used in a loose way.  
This means the IDE will still show the autocomplete options, but TS will also allow passing any other value of the same type.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import type { LooseUnion } from "@sv443-network/coreutils";

function foo(bar: LooseUnion<"a" | "b" | "c">) {
  console.log(bar);
}

// when typing the following, autocomplete suggests "a", "b" and "c"
// foo("

foo("a"); // included in autocomplete, no type error
foo("");  // *not* included in autocomplete, still no type error
foo(1);   // type error: Argument of type '1' is not assignable to parameter of type 'LooseUnion<"a" | "b" | "c">'
```
</details>

<br>

### `type NonEmptyArray`
```ts
type NonEmptyArray<TArray = unknown> = [TArray, ...TArray[]];
```
  
Describes an array with at least one item.  
  
<details><summary>Example - click to view</summary>

```ts
import type { NonEmptyArray } from "@sv443-network/coreutils";

function foo(arr: NonEmptyArray<string>) {
  console.log(arr.join(", "));
}

foo(["foo", "bar"]); // "foo, bar"
// @ts-expect-error
foo([]);             // TypeError
```
</details>

<br>

### `type Newable`
```ts
type Newable<T> = new (...args: any[]) => T;
```
  
Any newable / class reference (anything that can be instantiated with `new Foo()`).  
This doesn't refer to an instance of the class, just the reference to the newable/class itself.  

<br>

### `type NonEmptyString`
```ts
type NonEmptyString<TString extends string> = TString extends "" ? never : TString;
```
  
This generic type describes a string that has at least one character.  
It needs to be passed the string type itself via an `as const` assertion or a template literal type, like in the example below.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import type { NonEmptyString } from "@sv443-network/coreutils";

function convertToNumber<T extends string>(str: NonEmptyString<T>) {
  console.log(parseInt(str));
}

convertToNumber("04abc"); // 4
// @ts-expect-error
convertToNumber("");      // TypeError: Argument of type 'string' is not assignable to parameter of type 'never'
```
</details>

<br>

### `type Prettify`
```ts
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
```
  
A utility type that makes a type more readable by resolving all named types to their actual values.  
  
<details><summary><b>Example - click to view</b></summary>

```ts
import type { Prettify } from "@sv443-network/coreutils";

// tooltip shows all constituent types, leaving you to figure it out yourself:
// type Foo = {
//   a: number;
// } & Omit<{
//   b: string;
//   c: boolean;
// }, "c">
type Foo = {
  a: number;
} & Omit<{
  b: string;
  c: boolean;
}, "c">;

// tooltip shows just the type name, making you manually traverse to the type definition:
// const foo: Foo
const foo: Foo = {
  a: 1,
  b: "2"
};

// now with Prettify, the tooltips show the actual type structure:

// type Bar = {
//   a: number;
//   b: string;
// }
type Bar = Prettify<Foo>;

// const bar: {
//   a: number;
//   b: string;
// }
const bar: Bar = {
  a: 1,
  b: "2"
};
```
</details>

<br>

### `type SerializableVal`
```ts
type SerializableVal = string | number | boolean | null | SerializableVal[] | { [key: string]: SerializableVal };
```
  
Any value that can be serialized to JSON with `JSON.stringify()`.

<br>

### `type Stringifiable`
```ts
type Stringifiable = string | number | boolean | null | undefined | { toString(): string } | Stringifiable[];
```
  
Any value that can be *implicitly* converted to a string with `String(val)`, `val.toString()` or `${val}`  
Objects like [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) or objects returned by [`pureObj()`](#function-pureobj) are excluded from this type and will throw a TypeError when implicitly stringified with `${val}` (as opposed to explicitly with `String(val)` or `val.toString()`).

<br><br>
