---
"@sv443-network/coreutils": minor
---

Added new `DataStore` engine `IndexedDBStorageEngine` for DOM environments with access to [`indexedDB`](https://developer.mozilla.org/en-US/docs/Web/API/Window/indexedDB).  
This engine allows for larger storage limits and more complex data structures, including non-JSON-serializable and binary ([Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) / [File](https://developer.mozilla.org/en-US/docs/Web/API/File)) data.
