# @sv443-network/coreutils

## 3.0.8

### Patch Changes

- 3a57c81: Fixed initial DataStore deserialization from object.

## 3.0.7

### Patch Changes

- d40d50b: Fix DataStore defaultData initialization when data is in unexpected format.

## 3.0.6

### Patch Changes

- d17ec25: The `FileStorageEngine` for `DataStore`s now saves unencoded data as a plain object for easier editing.
  Previously saved stringified data will be loaded fine, but will be saved in the new format on the next save.

## 3.0.5

### Patch Changes

- bb69014: Made `DataStore.getData()` unavailable at the type level when `memoryCache` is set to `false`.

## 3.0.4

### Patch Changes

- f95b4ce: Fixed encoding and decoding being inconsistent between DataStore and DataStoreEngine.

## 3.0.3

### Patch Changes

- 918749b: Fixed decoding step when migrating DataStore data.

## 3.0.2

### Patch Changes

- 7e87d30: Update browser bundle from .min.umd.js to .mjs
- fa4c525: Removed `DataStoreSerializer` generic parameter.

## 3.0.1

### Patch Changes

- d6843f9: Fixed underlying `fetch()` props in `fetchAdvanced()` in stricter environments.
- 27e60dd: Made the type `DataStoreData` much less constrained. This way it won't require an index signature anymore.

## 3.0.0

### Major Changes

- 7718855: **Changed `DataStoreEngine` instances to allow storing original values instead of only strings.**

  The previous behavior of explicit serialization was prone to errors and made it hard to implement certain features, such as data migration from UserUtils.
  If you have created a custom `DataStoreEngine`, please ensure it supports storing and retrieving all values supported by JSON, i.e. `string`, `number`, `boolean`, `null`, `object` and `array`. Values like `undefined`, `Symbol`, `Function` etc. are still not supported and will lead to errors.

- 46570f4: **`NanoEmitter` multi methods' `oneOf` and `allOf` properties now behave like an AND condition instead of an OR.**

### Minor Changes

- 1124d2e: Added DataStoreSerializer property `remapIds` to support deserializing from stores with outdated IDs.
- 240f83e: Added DataStore prop `memoryCache` to turn off the memory cache in data-intensive, non-latency-sensitive scenarios.
- 7718855: Made DataStore able to migrate data from [UserUtils <=v9 DataStore](https://github.com/Sv443-Network/UserUtils/blob/v9.4.4/docs.md#datastore) instances.

  In order to trigger the migration:

  1. Switch the DataStore import from UserUtils to CoreUtils and keep the same DataStore ID.
  2. Update the options object in the DataStore constructor. (You may also want to refer to the [new DataStore documentation](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-datastore).)
     - The constructor now needs an `engine` property that is an instance of a [UserUtils `GMStorageEngine`.](https://github.com/Sv443-Network/UserUtils/blob/main/docs.md#class-gmstorageengine)
     - Encoding with `deflate-raw` will now be enabled by default. Set `compressionFormat: null` to disable compression if it wasn't enabled in the UserUtils DataStore.
     - Added shorthand property `compressionFormat` as an alternative to the properties `encodeData` and `decodeData`
     - `encodeData` and `decodeData` are now a tuple array, consisting of a format identifier string and the function which was previously the only value of these properties.
  3. The next call to `loadData()` will then migrate the data automatically and transparently.

### Patch Changes

- 99a797f: `secsToTimeStr()` now supports negative time and will only throw if the number is `NaN` or not finite.
- 38e7813: Implemented `DatedError`, `CustomError` and new classes `ScriptContextError` and `NetworkError` throughout the library.

## 2.0.3

### Patch Changes

- d4a043d: Fixed DataStore defaultData initialization

## 2.0.2

### Patch Changes

- a0a8d7e: Fixed race condition and getValue method return type in FileStorageEngine

## 2.0.1

### Patch Changes

- a011cb3: Fix FileStorageEngine path problems on Windows

## 2.0.0

### Major Changes

- 273fa5a: Removed the boolean property `__ds-${id}-enc` from the `DataStore` and `DataStoreEngine` classes.
  Now the key `__ds-${id}-enf` will hold the encoding format identifier string, or `null` if not set (will get created on the next write call).
  This will make it possible to switch the encoding format without compatibility issues.
  This functionality is not officially supported yet, but can be achieved manually by calling the storage API methods of `storeInstance.engine`

### Minor Changes

- 29fb048: Added `overflowVal()` to conform a value to an over- & undeflowing range
- 91cbe9c: Added optional abstract method `DataStoreEngine.deleteStorage()` for deleting the data storage container itself. If implemented in subclasses, it will be called from the method `DataStore.deleteData()`
- 3cae1cb: Added `dataStoreOptions` constructor prop to the DataStoreEngine subclasses to enable them to be used standalone.
- f6465b5: Added method `NanoEmitter.onMulti()` to listen to when multiple events have emitted, with fine grained options

## 1.0.0

This is the initial release of CoreUtils. Most features have been originally ported from [version 9.4.1 of `@sv443-network/userutils`](https://github.com/Sv443-Network/UserUtils/tree/v9.4.1)  
Parts of the code have been overhauled, and some features have been added:

- Additions:
  - Added [`capitalize()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-capitalize) to capitalize the first letter of a string.
  - Added [`setImmediateInterval()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-setimmediateinterval) to set an interval that runs immediately, then again on a fixed _interval._
  - Added [`setImmediateTimeoutLoop()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-setimmediatetimeoutloop) to set a recursive `setTimeout()` loop with a fixed _delay._
  - Added [`takeRandomItemIndex()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-takerandomitemindex), as a mutating counterpart to [`randomItemIndex()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-randomitemindex)
  - Added [`truncStr()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-truncstr) to truncate a string to a given length, optionally adding an ellipsis.
  - Added [`valsWithin()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-valswithin) to check if two values, rounded at the given decimal, are within a certain range of each other.
  - Added [`scheduleExit()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-scheduleexit) to schedule a Node/Deno process to exit with the given code, after the microtask queue is empty or after the given timeout.
- **BREAKING CHANGES:**
  - Reworked `DataStore`
    - The constructor now needs an `engine` property that is an instance of a [`DataStoreEngine`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-datastoreengine.)
    - Encoding with `deflate-raw` will now be enabled by default. Set `compressionFormat: null` to disable it and restore the previous behavior.
    - Added [`DataStoreEngine` class](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-datastoreengine) with two implementations available out-of-the-box; [`FileStorageEngine`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-filestorageengine) and [`BrowserStorageEngine`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-browserstorageengine), for Node/Deno and browser environments respectively. Userscripts need to use [`BrowserStorageEngine`.](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-browserstorageengine)
    - Added shorthand property `compressionFormat` as an alternative to the properties `encodeData` and `decodeData`
    - The global key `__ds_fmt_ver` will now contain a global version number for DataStore-internal format integrity.
  - Renamed `ab2str()` to `abtoa()` and `str2ab()` to `atoab()` to match the naming of `atob()` and `btoa()`
  - Renamed `purifyObj()` to `pureObj()`
