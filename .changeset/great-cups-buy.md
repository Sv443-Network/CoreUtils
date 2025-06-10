---
"@sv443-network/coreutils": minor
---

Added optional abstract method `DataStoreEngine.deleteStorage()` for deleting the data storage container itself. If implemented in subclasses, it will be called from the method `DataStore.deleteData()`
