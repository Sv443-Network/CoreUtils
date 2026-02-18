---
"@sv443-network/coreutils": patch
---

The `FileStorageEngine` for `DataStore`s now saves unencoded data as a plain object for easier editing.  
Previously saved stringified data will be loaded fine, but will be saved in the new format on the next save.
