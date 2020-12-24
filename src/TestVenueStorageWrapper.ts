import { IStorageWrapper } from "./BrowserWrappers/IStorageWrapper";
import { Venue } from "./Venue"

export class TestVenueStorageWrapper implements IStorageWrapper<Venue[]>{

    private _store:Map<string, Venue[]> = new Map<string, Venue[]>();

    Add(key: string, value: Venue[]): void {
        this._store.set(key, value);
    }
    
    Get(key: string):Venue[] | undefined {
        return this._store.get(key);       
    }
}