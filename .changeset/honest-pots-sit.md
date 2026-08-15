---
"@sv443-network/coreutils": minor
---

`DataStoreSerializer` now extends `PicoEmitter` and emits these events:
- `loadedAllStores`: Emitted once, whenever all contained DataStore instances have finished loading at least once. No arguments.
- `loadedStore`: Emitted once, whenever a contained DataStore instance has finished loading at least once. Gets passed the instance as the only argument.
- `resetStores`: Emitted whenever one or more stores have had their data reset to the default value. Gets passed an array of all instances that were reset.
- `deletedStores`: Emitted whenever one or more stores have had their persistent data cleared. Gets passed an array of all instances that were cleared.
