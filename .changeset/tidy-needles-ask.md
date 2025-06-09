---
"@sv443-network/coreutils": major
---

Removed the boolean property `__ds-${id}-enc` from the `DataStore` and `DataStoreEngine` classes.  
Now the key `__ds-${id}-enf` will hold the encoding format identifier string, or `null` if not set.
