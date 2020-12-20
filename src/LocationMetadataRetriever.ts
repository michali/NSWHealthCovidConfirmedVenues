import { ILocationMetadataRetriever } from "./ILocationMetadataRetriever";
import {LocationMetadata} from "./LocationMetadata";
import {IDownloader} from "./IDownloader";

class LocationMetadataRetriever implements ILocationMetadataRetriever
{
    downloader: IDownloader;
    metadataEndpoint: string = "https://data.nsw.gov.au/data/api/3/action/package_show?id=0a52e6c1-bc0b-48af-8b45-d791a6d8e289";

    constructor(downloader:IDownloader){
        this.downloader = downloader;
    }    

    Get(): LocationMetadata {
        var data = this.downloader.Download(this.metadataEndpoint);        
        var jsonObj = JSON.parse(data);        
        var LocationMetadata:LocationMetadata = jsonObj.result.resources.filter((x:any) => x.name.toLowerCase().includes("current case"))[0];
        return LocationMetadata;
    }
}