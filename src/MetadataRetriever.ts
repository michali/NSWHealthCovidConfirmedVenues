import { IMetaDataRetriever } from "./IMetaDataRetriever";
import {AppConfig} from "./AppConfig";
import {VenueMetadata} from "./VenueMetadata";
import {IDownloader} from "./IDownloader";

export class MetadataRetriever implements IMetaDataRetriever
{
    private metadataEndpointUrl: string;
    
    constructor(private downloader:IDownloader, appConfig:AppConfig){
        this.metadataEndpointUrl = appConfig.metadataEndpointUrl;
    }    

    Get(): VenueMetadata {
        var data = this.downloader.Download(this.metadataEndpointUrl).then(function(resposeText){
            var jsonObj = JSON.parse(data);
        });        
                
        var venueMetadata:VenueMetadata = jsonObj.result.resources.filter((x:any) => x.name.toLowerCase().includes("current case"))[0];
        return venueMetadata;
    }
}