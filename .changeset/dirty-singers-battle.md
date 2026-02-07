---
"@sv443-network/coreutils": major
---

**Changed `DataStoreEngine` instances to allow storing original values instead of only strings.**  
  
The previous behavior of explicit serialization was prone to errors and made it hard to implement certain features, such as data migration from UserUtils.  
If you have created a custom `DataStoreEngine`, please ensure it supports storing and retrieving all values supported by JSON, i.e. `string`, `number`, `boolean`, `null`, `object` and `array`. Values like `undefined`, `Symbol`, `Function` etc. are still not supported and will lead to errors.
