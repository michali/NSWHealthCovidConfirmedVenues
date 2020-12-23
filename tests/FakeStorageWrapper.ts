import { IStorageWrapper } from "../src/BrowserWrappers/IStorageWrapper";
import { Location } from "../src/Location";

export class FakeStorageWrapper implements IStorageWrapper<Location[]>{

    private _store:Map<string, Location[]> = new Map<string, Location[]>();

    Add(key: string, value: Location[]): void {
        this._store.set(key, value);
    }
    
    Get(key: string):Location[] | undefined {
        return this._store.get(key);       
    }
}