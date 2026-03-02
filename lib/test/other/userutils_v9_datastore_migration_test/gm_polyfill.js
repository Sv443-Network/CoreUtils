/**
 * @module test/other/userutils_v9_datastore_migration_test/gm_polyfill
 * GM API Polyfills for Datastore Migration Tests  
 * Mocked APIs:
 * - GM Storage (via localStorage)
 *   - `GM.getValue`
 *   - `GM.setValue`
 *   - `GM.deleteValue`
 *   - `GM.listValues`
 * - `unsafeWindow`
 */

/** Prefix to prevent collisions. */
let storageKeyPrefix = "gm_polyfill_test_";

var GM = {
  getValue(key, defaultValue) {
    const value = localStorage.getItem(`${storageKeyPrefix}${key}`);
    try {
      return value === null ? defaultValue : JSON.parse(value);
    }
    catch(err) {
      return value ?? defaultValue;
    }
  },
  setValue(key, value) {
    localStorage.setItem(`${storageKeyPrefix}${key}`, JSON.stringify(value));
    return Promise.resolve();
  },
  deleteValue(key) {
    localStorage.removeItem(`${storageKeyPrefix}${key}`);
    return Promise.resolve();
  },
  listValues() {
    const keys = [];
    for(let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if(fullKey.startsWith(storageKeyPrefix))
        keys.push(fullKey.substring(storageKeyPrefix.length));
    }
    return Promise.resolve(keys);
  },
};

/** @type {Window} */
var unsafeWindow = window;
