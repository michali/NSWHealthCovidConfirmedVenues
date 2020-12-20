import {LocationMetadata} from "./LocationMetadata";

export interface ILocationMetadataRetriever {
    Get(): LocationMetadata;
}
