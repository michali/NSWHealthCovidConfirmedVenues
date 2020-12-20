import { IDataRetriever } from "./IDataRetriever";
import {AppConfig} from "./AppConfig";
import {LocationMetadata} from "./LocationMetadata";
import {IDownloader} from "./IDownloader";

class MetadataRetriever implements IDataRetriever<LocationMetadata>
{
    downloader: IDownloader;
    metadataEndpointUrl: string;
    
    constructor(downloader:IDownloader, appConfig:AppConfig){
        this.downloader = downloader;
        this.metadataEndpointUrl = appConfig.metadataEndpointUrl;
    }    

    Get(): LocationMetadata {
        var data = this.downloader.Download(this.metadataEndpointUrl);        
        var jsonObj = JSON.parse(data);        
        var LocationMetadata:LocationMetadata = jsonObj.result.resources.filter((x:any) => x.name.toLowerCase().includes("current case"))[0];
        return LocationMetadata;
    }
}