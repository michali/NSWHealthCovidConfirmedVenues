import { IMetaDataRetriever } from "./IMetaDataRetriever";
import { ILocationRetriever } from "./ILocationRetriever";
import { Location } from "./Location";

export class NewVenuesRetriever{
    constructor(private locationMetadataRetriever: IMetaDataRetriever, private locationRetriever: ILocationRetriever){
    }

    Get(): Location[] {
        var metadata = this.locationMetadataRetriever.Get();
        var locations = this.locationRetriever.Get(metadata.url);
        return locations;
    }
}