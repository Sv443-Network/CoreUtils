import { DataStore, type DataStoreData } from "./DataStore.ts";
import type { SerializableVal } from "./types.ts";

/**
 * A DataStore wrapper subclass that exposes internal methods for testing via the `direct_` prefixed methods.
 */
export class TestDataStore<TData extends DataStoreData> extends DataStore<TData> {
  public async direct_getValue<TValue extends SerializableVal = string>(name: string, defaultValue: TValue): Promise<string | TValue> {
    return await this.engine.getValue(name, defaultValue);
  }

  public async direct_setValue(name: string, value: SerializableVal): Promise<void> {
    return await this.engine.setValue(name, value);
  }

  public async direct_renameKey(oldName: string, newName: string): Promise<void> {
    const value = await this.engine.getValue(oldName, null);
    if(value) {
      await this.engine.setValue(newName, value);
      await this.engine.deleteValue(oldName);
    }
  }

  public async direct_deleteValue(name: string): Promise<void> {
    return await this.engine.deleteValue(name);
  }

  public direct_setFirstInit(value: boolean): void {
    this.firstInit = value;
  }
}
