import { IDownloader } from "./IDownloader";
import { IVenueRetriever } from "./IVenueRetriever";
import { Venue } from "./Venue";

export class VenueRetriever implements IVenueRetriever{

    constructor(private _downloader: IDownloader){        
    }

    Get(url: string): Promise<Venue[]> {
        var map = this.Map;        
        return this._downloader.Download(url).then(function(data){
            var venues : Venue[] = [];
            var jsonObj = JSON.parse(data);
            if (jsonObj.data.monitor !== undefined){
                jsonObj.data.monitor.forEach((element:any) => {
                    venues.push(map(element, "monitor"));
                });
            }
    
            if (jsonObj.data.negative !== undefined){
                jsonObj.data.negative.forEach((element:any) => {
                    venues.push(map(element, "test_until_negative"));
                });
            }
    
            if (jsonObj.data.isolate !== undefined){
                jsonObj.data.isolate.forEach((element:any) => {
                    venues.push(map(element, "isolate"));
                });
            }

            return venues;
        }, 
        function(error) {
            console.error("Failed!", error);
            throw error;
        });  
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