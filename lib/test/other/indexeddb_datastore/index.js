(async () => {
  const store = new CoreUtils.DataStore({
    id: "indexeddb-test",
    engine: new CoreUtils.IndexedDBStorageEngine(),
    formatVersion: 0,
    defaultData: {
      foo: 0,
    },
  });

  console.log(">>1", store);

  const data = await store.loadData();

  console.log(">>2", data);

  data.foo = 1;
  await store.setData(data);

  console.log(">>3", store.getData());
})();
