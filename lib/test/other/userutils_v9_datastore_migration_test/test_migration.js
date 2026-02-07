/** @type {import("../../../DataStore").DataStore} */
var ds1 = new CoreUtils.DataStore({
  id: "uuv9_cuv2_migration_test-1",
  formatVersion: 1,
  defaultData: {
    name: "ds1 [cuv2, deflate-raw]",
    foo: "(x)",
    bar: "(x)",
  },
  encodeData: (data) => UserUtils.compress(data, "deflate-raw", "string"),
  decodeData: (data) => UserUtils.decompress(data, "deflate-raw", "string"),
});

/** @type {import("../../../DataStore").DataStore} */
var ds2 = new CoreUtils.DataStore({
  id: "uuv9_cuv2_migration_test-2",
  formatVersion: 1,
  defaultData: {
    name: "ds2 [cuv2, identity]",
    foo: "(x)",
    bar: "(x)",
  },
});

globalThis.__TestMigration = { ds1, ds2 };
