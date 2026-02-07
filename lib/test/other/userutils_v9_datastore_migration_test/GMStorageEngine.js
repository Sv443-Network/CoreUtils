class GMStorageEngine extends CoreUtils.DataStoreEngine {
  constructor(options) {
    super(options?.dataStoreOptions);
    this.options = {
      ...options,
    };
  }

  async getValue(name, defaultValue) {
    try {
      const value = await GM.getValue(name, defaultValue);
      return value;
    }
    catch(err) {
      console.error(`Error getting value for key "${name}":`, err);
      throw err;
    }
  }

  async setValue(name, value) {
    try {
      await GM.setValue(name, value);
    }
    catch(err) {
      console.error(`Error setting value for key "${name}":`, err);
      throw err;
    }
  }

  async deleteValue(name) {
    try {
      await GM.deleteValue(name);
    }
    catch(err) {
      console.error(`Error deleting value for key "${name}":`, err);
      throw err;
    }
  }

  async deleteStorage() {
    try {
      const keys = await GM.listValues();
      for(const key of keys) {
        await GM.deleteValue(key);
      }
    }
    catch(err) {
      console.error("Error deleting storage:", err);
      throw err;
    }
  }
}
