/** @type {import("../../../DataStore").DataStore} */
var ds1 = new CoreUtils.DataStore({
  id: "uuv9_cuv2_migration_test-1",
  formatVersion: 1,
  engine: new GMStorageEngine(),
  defaultData: {
    name: "ds1 [cuv2, deflate-raw]",
    baz: "(x)",
  },
  encodeData: ["deflate-raw", (data) => UserUtils.compress(data, "deflate-raw", "string")],
  decodeData: ["deflate-raw", (data) => UserUtils.decompress(data, "deflate-raw", "string")],
});

/** @type {import("../../../DataStore").DataStore} */
var ds2 = new CoreUtils.DataStore({
  id: "uuv9_cuv2_migration_test-2",
  formatVersion: 2,
  engine: new GMStorageEngine(),
  compressionFormat: null,
  defaultData: {
    name: "ds2 [cuv2, identity]",
    baz: "(x)",
    migrated: false,
  },
  migrations: {
    2: (oldData) => ({
      ...oldData,
      migrated: true,
    }),
  },
});

globalThis.__TestMigration = { ds1, ds2 };
