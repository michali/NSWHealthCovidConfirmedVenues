import { IDownloader } from "./IDownloader";
import { IVenueRetriever } from "./IVenueRetriever";
import { Venue } from "./Venue";

export class VenueRetriever implements IVenueRetriever{

    constructor(private _downloader: IDownloader){        
    }

    async Get(url: string): Promise<Venue[]> {    
        var data = await this._downloader.Download(url);
        var venues : Venue[] = [];
        var jsonObj = JSON.parse(data);


        if (jsonObj.data.monitor !== undefined){
            jsonObj.data.monitor.forEach((element:any) => {
                venues.push(this.Map(element, "monitor"));
            });
        }

        if (jsonObj.data.negative !== undefined){
            jsonObj.data.negative.forEach((element:any) => {
                venues.push(this.Map(element, "test_until_negative"));
            });
        }

        if (jsonObj.data.isolate !== undefined){
            jsonObj.data.isolate.forEach((element:any) => {
                venues.push(this.Map(element, "isolate"));
            });
        }

        return venues;          
    }    

    private Map(element:any, venueType:string):Venue{
        return {
            name: element.Venue,
            address: element.Address,
            suburb: element.Suburb,
            date: element.Date,
            time: element.Time,
            alert: element.Alert,
            healthAdviceHtml: element.HealthAdviceHTML,
            type: venueType
        }
    }
}