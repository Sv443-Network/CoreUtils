/** @type {import("../../../DataStore").DataStore} */
var ds1 = new UserUtils.DataStore({
  id: "uuv9_cuv2_migration_test-1",
  formatVersion: 1,
  defaultData: {
    name: "ds1 [uuv9, deflate-raw]",
    foo: "bar",
  },
  encodeData: (data) => UserUtils.compress(data, "deflate-raw", "string"),
  decodeData: (data) => UserUtils.decompress(data, "deflate-raw", "string"),
});

/** @type {import("../../../DataStore").DataStore} */
var ds2 = new UserUtils.DataStore({
  id: "uuv9_cuv2_migration_test-2",
  formatVersion: 1,
  defaultData: {
    name: "ds2 [uuv9, identity]",
    foo: "bar",
  },
});

globalThis.__TestSetup = { ds1, ds2 };
