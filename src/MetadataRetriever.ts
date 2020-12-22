import { IMetaDataRetriever } from "./IMetaDataRetriever";
import {AppConfig} from "./AppConfig";
import {LocationMetadata} from "./LocationMetadata";
import {IDownloader} from "./IDownloader";

export class MetadataRetriever implements IMetaDataRetriever
{
    private metadataEndpointUrl: string;
    
    constructor(private downloader:IDownloader, appConfig:AppConfig){
        this.metadataEndpointUrl = appConfig.metadataEndpointUrl;
    }    

    Get(): LocationMetadata {
        var data = this.downloader.Download(this.metadataEndpointUrl);        
        var jsonObj = JSON.parse(data);        
        var LocationMetadata:LocationMetadata = jsonObj.result.resources.filter((x:any) => x.name.toLowerCase().includes("current case"))[0];
        return LocationMetadata;
    }
}