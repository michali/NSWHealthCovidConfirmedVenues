
import { IStorageWrapper } from '../src/BrowserWrappers/IStorageWrapper';
import { NewLocationsRetriever } from '../src/NewLocationsRetriever';

class FakeLocationStorageWrapper implements IStorageWrapper<Location[]>{

    private _store:Map<string, Location[]> = new Map<string, Location[]>();

    Add(key: string, value: Location[]): void {
        this._store.set(key, value);
    }
    
    Get(key: string):Location[] | undefined {
        return this._store.get(key);       
    }
}

describe("New Locations Retriever", function() {

    var metadataRetriever:any;
    var locationRetriever:any;
    var storageWrapper: any;
    var newLocationsRetriever: NewLocationsRetriever; 
    beforeEach(() => {
        metadataRetriever = jasmine.createSpyObj("metadataRetriever", ["Get"]);
        locationRetriever = jasmine.createSpyObj("locationRetriever", ["Get"]);
        storageWrapper = new FakeLocationStorageWrapper();
        newLocationsRetriever = new NewLocationsRetriever(metadataRetriever, locationRetriever, storageWrapper);
    });
          
    it("First run gets all locations", function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            venue: "venue name 1",
            address: "address 1"
        },
        {
            venue: "venue name 2",
            address: "address 2"
        }]);

        var updates = newLocationsRetriever.Get();

        expect(updates).toHaveSize(2);
    });

    it("Second run, if new locations, return only new locations", function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        }]);

        newLocationsRetriever.Get();

        var newLocation = {
            name: "venue name 2",
            address: "address 2",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        }

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        },
        newLocation]);

        var updates = newLocationsRetriever.Get();

        expect(updates).toHaveSize(1);
        expect(updates[0]).toBe(newLocation);
    });

    it("Second run, if locations removed, return no updates", function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
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

        newLocationsRetriever.Get();

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        }]);

        var updates = newLocationsRetriever.Get();

        expect(updates).toHaveSize(0);
    });

    it("Second run, if set different, return new set only", function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
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

        newLocationsRetriever.Get();

        var newLocation = {
            name: "venue name 3",
            address: "address 3",
            suburb: "suburb",
            date: "date",
            time: "time",
            alert: "alert",
            healthAdviceHtml: "health advice",
            type:"foo"
        }

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([newLocation]);

        var updates = newLocationsRetriever.Get();

        expect(updates).toHaveSize(1);
        expect(updates[0]).toBe(newLocation);
    });
  });
      
  
  