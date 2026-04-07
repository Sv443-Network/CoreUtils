---
"@sv443-network/coreutils": minor
---

Added optional `catchUpEvents` option to `NanoEmitter` and `NanoEmitterOptions`. When provided with a list of event names, the emitter remembers the last arguments of each listed event. Any listener attached via `on()` or `once()` after such an event has already fired will be immediately called / resolved with the cached arguments. Also added the protected `emitEvent()` method for subclasses - it behaves identically to `this.events.emit()` but additionally updates the catch-up cache and should thus be preferred over `this.events.emit()`.
