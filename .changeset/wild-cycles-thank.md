---
"@sv443-network/coreutils": minor
---

`DataStore` now extends `NanoEmitter` to allow for much better event-driven programming using the methods `on()`, `once()`, `onMulti()`, etc.  
Currently, the following events are emitted by the `DataStore` class:

| Name | Description |
| :-- | :-- |
| `loadData` | Whenever the data is loaded from persistent storage with `DataStore.loadData()`. |
| `updateData` | When the data is updated with `DataStore.setData()` or `DataStore.runMigrations()`. |
| `updateDataSync` | When the memory cache was updated with `DataStore.setData()`, before the data is saved to persistent storage. Not emitted if `memoryCache` is set to `false`. |
| `migrateData` | For every called migration function with the resulting data. |
| `migrateId` | For every successfully migrated old ID. Gets passed the old and new ID. |
| `setDefaultData` | Whenever the data is reset to the default value with `DataStore.saveDefaultData()` (will not be called on the initial population of persistent storage with the default data in `DataStore.loadData()`). |
| `deleteData` | After the data was deleted from persistent storage with `DataStore.deleteData()`. |
| `error` | When an error occurs at any point. |
| `migrationError` | Only when an error occurs during a migration function. |
