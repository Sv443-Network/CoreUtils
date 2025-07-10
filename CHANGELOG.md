# @sv443-network/coreutils

## 1.0.0

This is the initial release of CoreUtils. Most features have been originally ported from [version 9.4.1 of `@sv443-network/userutils`](https://github.com/Sv443-Network/UserUtils/tree/v9.4.1)  
Parts of the code have been overhauled, and some features have been added:
- Additions:
  - Added [`capitalize()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-capitalize) to capitalize the first letter of a string.
  - Added [`setImmediateInterval()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-setimmediateinterval) to set an interval that runs immediately, then again on a fixed *interval.*
  - Added [`setImmediateTimeoutLoop()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-setimmediatetimeoutloop) to set a recursive `setTimeout()` loop with a fixed *delay.*
  - Added [`takeRandomItemIndex()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-takerandomitemindex), as a mutating counterpart to [`randomItemIndex()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-randomitemindex)
  - Added [`truncStr()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-truncstr) to truncate a string to a given length, optionally adding an ellipsis.
  - Added [`valsWithin()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-valswithin) to check if two values, rounded at the given decimal, are within a certain range of each other.
  - Added [`scheduleExit()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#function-scheduleexit) to schedule a Node/Deno process to exit with the given code, after the microtask queue is empty or after the given timeout.
  - Added [`NanoEmitter.onMulti()`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#nanoemitteronmulti) to listen for multiple events at once, with the option to specify if any or all of the events should be emitted before calling the callback.
- **BREAKING CHANGES:**
  - Reworked `DataStore`
    - The constructor now needs an `engine` property that is an instance of a [`DataStoreEngine`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-datastoreengine.)
    - Encoding with `deflate-raw` will now be enabled by default. Set `compressionFormat: null` to disable it and restore the previous behavior.
    - Added [`DataStoreEngine` class](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-datastoreengine) with two implementations available out-of-the-box; [`FileStorageEngine`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-filestorageengine) and [`BrowserStorageEngine`](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-browserstorageengine), for Node/Deno and browser environments respectively. Userscripts need to use [`BrowserStorageEngine`.](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-browserstorageengine)
    - Added shorthand property `compressionFormat` as an alternative to the properties `encodeData` and `decodeData`
    - The global key `__ds_fmt_ver` will now contain a global version number for DataStore-internal format integrity.
  - Renamed `ab2str()` to `abtoa()` and `str2ab()` to `atoab()` to match the naming of `atob()` and `btoa()`
  - Renamed `purifyObj()` to `pureObj()`
