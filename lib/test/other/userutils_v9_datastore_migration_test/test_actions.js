async function logAllStorage() {
  try {
    console.info("Logging all storage:");

    const gmKeys = await GM.listValues();
    const longestKeyLength = gmKeys.reduce((max, key) => Math.max(max, key.length), 0);
    const lines = [];
    for(const key of gmKeys) {
      const value = await GM.getValue(key);
      const spaces = " ".repeat(longestKeyLength - key.length + 1);
      lines.push(`${key}:${spaces}${value}`);
    }

    if(lines.length === 0)
      console.warn("No values found in GM storage.");
    else
      console.log(lines.join("\n"));
  }
  catch(err) {
    console.error("Error logging all storage:", err);
  }
}

async function deleteAllData() {
  try {
    console.info("Deleting all data:");

    console.log("Clearing ds1...");
    await ds1.deleteData();

    console.log("Clearing ds2...");
    await ds2.deleteData();

    console.log("All data deleted.");
  }
  catch(err) {
    console.error("Error deleting all data:", err);
  }
}

async function loadDsData() {
  try {
    console.info("Loading UserUtils v9 DataStores:");

    console.log("Loading ds1...");
    await ds1.loadData();
    console.log("ds1 data:", ds1.getData());

    console.log("Loading ds2...");
    await ds2.loadData();
    console.log("ds2 data:", ds2.getData());

    console.log("UserUtils v9 DataStores loaded.");
  }
  catch(err) {
    console.error("Error loading UserUtils v9 DataStores:", err);
  }
}

async function modifyDsData() {
  try {
    console.info("Setting data in UserUtils v9 DataStores:");

    console.log("Setting data in ds1...");
    await ds1.setData({
      ...ds1.getData(),
      foo: "modified-bar",
      newField: "newValue1",
    });
    console.log("ds1 data after setData:", ds1.getData());

    console.log("Setting data in ds2...");
    await ds2.setData({
      ...ds2.getData(),
      foo: "modified-bar",
      newField: "newValue2",
    });
    console.log("ds2 data after setData:", ds2.getData());

    console.log("Data set in UserUtils v9 DataStores.");
  }
  catch(err) {
    console.error("Error setting data in UserUtils v9 DataStores:", err);
  }
}

function bindButtons() {
  const logStorageBtn = document.getElementById("btn-log-storage");
  if(logStorageBtn)
    logStorageBtn.addEventListener("click", () => logAllStorage());

  const deleteStorageBtn = document.getElementById("btn-delete-storage");
  if(deleteStorageBtn)
    deleteStorageBtn.addEventListener("click", () => deleteAllData());

  const loadDataBtn = document.getElementById("btn-load-datastores");
  if(loadDataBtn)
    loadDataBtn.addEventListener("click", () => loadDsData());

  const modDataBtn = document.getElementById("btn-modify-datastores-data");
  if(modDataBtn)
    modDataBtn.addEventListener("click", () => modifyDsData());

  const decodeBtn = document.getElementById("btn-decode");
  const decodeInput = document.getElementById("input-decode");
  if(decodeBtn && decodeInput)
    decodeBtn.addEventListener("click", async () => {
      const inputValue = decodeInput.value;
      try {
        const decoded = await CoreUtils.decompress(inputValue, "deflate-raw", "string");
        console.log("Decoded value:", decoded);
      }
      catch(err) {
        console.error("Error decoding value:", err);
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  bindButtons();
});
