import { IStorageWrapper } from "./BrowserWrappers/IStorageWrapper";

export class TestStorageWrapper implements IStorageWrapper{

    private _store:Map<string, string> = new Map<string, string>();

    Add<T>(key: string, value: T): void {
        var serialised = JSON.stringify(value);
        this._store.set(key, serialised);
    }
    
    Get<T>(key: string):T | null {
        var serialised = this._store.get(key);
        if (serialised === undefined){
            return null;
        }  
        var deserialised: T = JSON.parse(serialised);
        return deserialised;
    }
}