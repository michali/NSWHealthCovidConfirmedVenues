import { VenueMetadata } from "./VenueMetadata";

export interface IMetaDataRetriever {
    Get(): Promise<VenueMetadata>;
}
