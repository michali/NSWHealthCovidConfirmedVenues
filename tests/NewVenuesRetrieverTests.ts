import { IStorageWrapper } from '../src/BrowserWrappers/IStorageWrapper';
import { NewVenuesRetriever } from '../src/NewVenuesRetriever';
import { Venue } from '../src/Venue';

class FakeVenueStorageWrapper implements IStorageWrapper<Venue[]>{

    private _store:Map<string, Venue[]> = new Map<string, Venue[]>();

    Add(key: string, value: Venue[]): void {
        this._store.set(key, value);
    }
    
    Get(key: string):Venue[] | undefined {
        return this._store.get(key);       
    }
}

describe("New Venues Retriever", function() {

    var metadataRetriever:any;
    var venueRetriever:any;
    var storageWrapper: any;
    var newVenuesRetriever: NewVenuesRetriever; 
    beforeEach(() => {
        metadataRetriever = jasmine.createSpyObj("metadataRetriever", ["Get"]);
        venueRetriever = jasmine.createSpyObj("venueRetriever", ["Get"]);
        storageWrapper = new FakeVenueStorageWrapper();
        newVenuesRetriever = new NewVenuesRetriever(metadataRetriever, venueRetriever, storageWrapper);
    });
          
    it("First run gets all venues", function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        venueRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            venue: "venue name 1",
            address: "address 1"
        },
        {
            venue: "venue name 2",
            address: "address 2"
        }]);

        var updates = newVenuesRetriever.Get();

        expect(updates).toHaveSize(2);
    });

    it("Second run, if new venues, return only new venues", function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        venueRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        }]);

        newVenuesRetriever.Get();

        var newVenue = {
            name: "venue name 2",
            address: "address 2",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        }

        venueRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        },
        newVenue]);

        var updates = newVenuesRetriever.Get();

        expect(updates).toHaveSize(1);
        expect(updates[0]).toBe(newVenue);
    });

    it("Second run, if venues removed, return no updates", function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        venueRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        },
        {
            name: "venue name 2",
            address: "address 2",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        }]);

        newVenuesRetriever.Get();

        venueRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        }]);

        var updates = newVenuesRetriever.Get();

        expect(updates).toHaveSize(0);
    });

    it("Second run, if set different, return new set only", function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        venueRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        },
        {
            name: "venue name 2",
            address: "address 2",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        }]);

        newVenuesRetriever.Get();

        var newVenue = {
            name: "venue name 3",
            address: "address 3",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        }

        venueRetriever.Get.withArgs("https://path.to/url").and.returnValue([newVenue]);

        var updates = newVenuesRetriever.Get();

        expect(updates).toHaveSize(1);
        expect(updates[0]).toBe(newVenue);
    });
  });
      
  
  