import { IMetaDataRetriever } from "./IMetaDataRetriever";
import { ILocationRetriever } from "./ILocationRetriever";
import { Location } from "./Location";
import { IStorageWrapper } from "./BrowserWrappers/IStorageWrapper";

export class NewLocationsRetriever{
    constructor(private _locationMetadataRetriever: IMetaDataRetriever, private _locationRetriever: ILocationRetriever, private _storage: IStorageWrapper<Location[]>){
    }

    private _existingLocationsKey = "existingLocations";

    Get(): Location[] {
        var metadata = this._locationMetadataRetriever.Get();
        var locations = this._locationRetriever.Get(metadata.url);

        var existingLocations = this._storage.Get(this._existingLocationsKey);

        var newLocations = locations.filter(({ name: name1 }) => !existingLocations?.some(({ name: name2 }) => name1 === name2));

        this._storage.Add(this._existingLocationsKey, locations);    

        return newLocations; 
    }
}