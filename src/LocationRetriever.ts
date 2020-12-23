import { IDownloader } from "./IDownloader";
import { ILocationRetriever } from "./ILocationRetriever";
import { Location } from "./Location";

export class LocationRetriever implements ILocationRetriever{

    constructor(private _downloader: IDownloader){        
    }

    Get(url: string): Location[] {
        var data = this._downloader.Download(url);
        var jsonObj = JSON.parse(data);
        var locations:Location[] = [];
        jsonObj.data.monitor.forEach((element:any) => {
            var location = {
                name: element.Venue,
                address: element.Address,
                suburb: element.Suburb,
                date: element.Date,
                time: element.Time,
                alert: element.Alert,
                healthAdviceHtml: element.HealthAdviceHTML
            }
            locations.push(location);
        });
        jsonObj.data.isolate.forEach((element:any) => {
            var location = {
                name: element.Venue,
                address: element.Address,
                suburb: element.Suburb,
                date: element.Date,
                time: element.Time,
                alert: element.Alert,
                healthAdviceHtml: element.HealthAdviceHTML
            }
            locations.push(location);
        });
        return locations;
    }    
}