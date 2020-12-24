import { IMetaDataRetriever } from "./IMetaDataRetriever";
import { IVenueRetriever } from "./IVenueRetriever";
import { Venue } from "./Venue";
import { IStorageWrapper } from "./BrowserWrappers/IStorageWrapper";
import { VenueMetadata } from "./VenueMetadata";

export class NewVenuesRetriever{
    constructor(private _venueMetadataRetriever: IMetaDataRetriever, private _venueRetriever: IVenueRetriever, private _storage: IStorageWrapper){
    }

    private _existingVenuesKey = "confirmedvenues.existing";
    private _lastModifiedKey = "confirmedvenues.last_modified";

    Get(): Venue[] {
        var metadata = this._venueMetadataRetriever.Get();

       if (metadata.last_modified === this._storage.Get<Date>(this._lastModifiedKey)){
           return [];
       }

       this._storage.Add(this._lastModifiedKey, metadata.last_modified);

        var venues = this._venueRetriever.Get(metadata.url);

        var existingVenues = this._storage.Get<Venue[]>(this._existingVenuesKey);

        var newVenues = venues.filter(({ name: name1 }) => !existingVenues?.some(({ name: name2 }) => name1 === name2));

        this._storage.Add(this._existingVenuesKey, venues);    

        return newVenues; 
    }
}