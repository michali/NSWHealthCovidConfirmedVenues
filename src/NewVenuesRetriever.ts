import { IMetaDataRetriever } from "./IMetaDataRetriever";
import { IVenueRetriever } from "./IVenueRetriever";
import { Venue } from "./Venue";
import { IStorageWrapper } from "./BrowserWrappers/IStorageWrapper";

export class NewVenuesRetriever{
    constructor(private _venueMetadataRetriever: IMetaDataRetriever, private _venueRetriever: IVenueRetriever, private _storage: IStorageWrapper<Venue[]>){
    }

    private _existingVenuesKey = "existingVenues";

    Get(): Venue[] {
        var metadata = this._venueMetadataRetriever.Get();
        var venues = this._venueRetriever.Get(metadata.url);

        var existingVenues = this._storage.Get(this._existingVenuesKey);

        var newVenues = venues.filter(({ name: name1 }) => !existingVenues?.some(({ name: name2 }) => name1 === name2));

        this._storage.Add(this._existingVenuesKey, venues);    

        return newVenues; 
    }
}