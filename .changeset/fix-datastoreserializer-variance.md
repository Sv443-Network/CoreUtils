---
"@sv443-network/coreutils": patch
---

Fixed type variance issue in `DataStoreSerializer` where `DataStore` instances with specific data types (e.g. `DataStore<MyType>`) couldn't be passed to the constructor without being asserted `as DataStore<DataStoreData, boolean>`.
