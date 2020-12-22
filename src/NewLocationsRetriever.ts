import { IMetaDataRetriever } from "./IMetaDataRetriever";
import { ILocationRetriever } from "./ILocationRetriever";
import { Location } from "./Location";

export class NewVenuesRetriever{
    constructor(private locationMetadataRetriever: IMetaDataRetriever, private locationRetriever: ILocationRetriever){
    }

    private _existingLocations: Location[] = [];

    Get(): Location[] {
        var metadata = this.locationMetadataRetriever.Get();
        var locations = this.locationRetriever.Get(metadata.url);

        if (this._existingLocations.length > 0){
            var newLocations = locations.filter(({ name: name1 }) => !this._existingLocations.some(({ name: name2 }) => name1 === name2)); //x => !this._existingLocations.has(x)));
            this._existingLocations = locations;            
            return newLocations;
        }

        this._existingLocations = locations;
        return locations;
    }
}