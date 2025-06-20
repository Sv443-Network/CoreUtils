---
"@sv443-network/coreutils": major
---

Removed the boolean property `__ds-${id}-enc` from the `DataStore` and `DataStoreEngine` classes.  
Now the key `__ds-${id}-enf` will hold the encoding format identifier string, or `null` if not set (will get created on the next write call).  
This will make it possible to switch the encoding format without compatibility issues.  
This functionality is not officially supported yet, but can be achieved manually by calling the storage API methods of `storeInstance.engine`
