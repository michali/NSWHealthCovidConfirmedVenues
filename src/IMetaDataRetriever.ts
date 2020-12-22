import { LocationMetadata } from "./LocationMetadata";

export interface IMetaDataRetriever {
    Get(): LocationMetadata;
}
