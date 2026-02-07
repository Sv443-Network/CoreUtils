---
"@sv443-network/coreutils": minor
---

Made DataStore able to migrate data from [UserUtils <=v9 DataStore](https://github.com/Sv443-Network/UserUtils/blob/v9.4.4/docs.md#datastore) instances.  
  
In order to trigger the migration:
1. Switch the DataStore import from UserUtils to CoreUtils and keep the same DataStore ID.
2. Update the options object in the DataStore constructor. (You may also want to refer to the [new DataStore documentation](https://github.com/Sv443-Network/CoreUtils/blob/main/docs.md#class-datastore).)
    - The constructor now needs an `engine` property that is an instance of a [UserUtils `GMStorageEngine`.](https://github.com/Sv443-Network/UserUtils/blob/main/docs.md#class-gmstorageengine)
    - Encoding with `deflate-raw` will now be enabled by default. Set `compressionFormat: null` to disable compression if it wasn't enabled in the UserUtils DataStore.
    - Added shorthand property `compressionFormat` as an alternative to the properties `encodeData` and `decodeData`
    - `encodeData` and `decodeData` are now a tuple array, consisting of a format identifier string and the function which was previously the only value of these properties.
3. The next call to `loadData()` will then migrate the data automatically and transparently.
