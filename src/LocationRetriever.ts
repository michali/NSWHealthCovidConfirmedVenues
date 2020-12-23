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
            locations.push(this.Map(element));
        });
        jsonObj.data.isolate.forEach((element:any) => {
            locations.push(this.Map(element));
        });
        return locations;
    }    

    private Map(element:any):Location{
        return {
            name: element.Venue,
            address: element.Address,
            suburb: element.Suburb,
            date: element.Date,
            time: element.Time,
            alert: element.Alert,
            healthAdviceHtml: element.HealthAdviceHTML
        }
    }
}