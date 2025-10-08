---
"@sv443-network/coreutils": patch
---

`secsToTimeStr()` now supports negative time and will only throw if the number is `NaN` or not finite
