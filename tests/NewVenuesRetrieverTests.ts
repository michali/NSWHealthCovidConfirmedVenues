import { NewVenuesRetriever } from '../src/NewVenuesRetriever';
import { IStorageWrapper } from '../src/BrowserWrappers/IStorageWrapper';

class TestStorageWrapper implements IStorageWrapper{

    private _store:Map<string, string> = new Map<string, string>();

    Add<T>(key: string, value: T): void {
        var serialised = JSON.stringify(value);
        this._store.set(key, serialised);
    }
    
    Get<T>(key: string):T | null {
        var serialised = this._store.get(key);
        if (serialised === undefined){
            return null;
        }  
        var deserialised: T = JSON.parse(serialised);
        return deserialised;
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
        storageWrapper = new TestStorageWrapper();
        newVenuesRetriever = new NewVenuesRetriever(metadataRetriever, venueRetriever, storageWrapper);
    });
          
    it("First run gets all venues", async function() {
      
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

        var updates = await newVenuesRetriever.Get();

        expect(updates).toHaveSize(2);
    });

    it("Second run, if new venues, return only new venues", async function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.000000",
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

        await newVenuesRetriever.Get();

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

        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:50.000000",
            url: "https://path.to/url"
        });

        var updates = await newVenuesRetriever.Get();

        expect(updates).toHaveSize(1);
        expect(updates[0]).toBe(newVenue);
    });

    it("Second run, if venues removed, return no updates", async function() {
      
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

        await newVenuesRetriever.Get();

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

        var updates = await newVenuesRetriever.Get();

        expect(updates).toHaveSize(0);
    });

    it("Second run, if set different, return new set only", async function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.000000",
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

        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:50.000000",
            url: "https://path.to/url"
        });

        venueRetriever.Get.withArgs("https://path.to/url").and.returnValue([newVenue]);

        var updates = await newVenuesRetriever.Get();

        expect(updates).toHaveSize(1);
        expect(updates[0]).toBe(newVenue);
    });

    it("If data hasn't changed in second run, don't download", async function() {
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

        await newVenuesRetriever.Get();
        var venues = await newVenuesRetriever.Get();
        
        expect(venues).toHaveSize(0);
        expect(venueRetriever.Get).toHaveBeenCalledTimes(1);
    });

    it("Store date and time of reaching out to get new venues", async function() {
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        spyOn(storageWrapper, 'Add');

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

        jasmine.clock().install();
        var dateTime = new Date(2020, 10, 25);
        jasmine.clock().mockDate(dateTime);

        await newVenuesRetriever.Get();
        
        jasmine.clock().uninstall();

        expect(storageWrapper.Add).toHaveBeenCalledWith("confirmedvenues.last_accessed", dateTime);
    });

    it("Handles errors", async function() {
               
        metadataRetriever.Get.and.throwError(new Error("This has failed"));
        spyOn(storageWrapper, 'Add');

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

        await expectAsync(newVenuesRetriever.Get()).toBeRejectedWithError("Error occurred when getting new venues");
    });
  });
      
  
  