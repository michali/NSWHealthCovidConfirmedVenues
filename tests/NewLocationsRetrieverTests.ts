
import {NewVenuesRetriever as NewLocationsRetriever} from '../src/NewLocationsRetriever';
import { FakeStorageWrapper as FakeLocationStorageWrapper } from './FakeStorageWrapper';

describe("New Locations Retriever", function() {

    var metadataRetriever:any;
    var locationRetriever:any;
    var storageWrapper: any;
    var newVenuesRetriever: NewLocationsRetriever; 
    beforeEach(() => {
        metadataRetriever = jasmine.createSpyObj("metadataRetriever", ["Get"]);
        locationRetriever = jasmine.createSpyObj("locationRetriever", ["Get"]);
        storageWrapper = new FakeLocationStorageWrapper();
        newVenuesRetriever = new NewLocationsRetriever(metadataRetriever, locationRetriever, storageWrapper);
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

        var updates = newVenuesRetriever.Get();

        expect(updates).toHaveSize(2);
    });

    it("Second run, if new locations, return only new locations", function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1"
        }]);

        newVenuesRetriever.Get();

        var newLocation = {
            name: "venue name 2",
            address: "address 2"
        }

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1"
        },
        newLocation]);

        var updates = newVenuesRetriever.Get();

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
            address: "address 1"
        },
        {
            name: "venue name 2",
            address: "address 2"  
        }]);

        newVenuesRetriever.Get();

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1"
        }]);

        var updates = newVenuesRetriever.Get();

        expect(updates).toHaveSize(0);
    });

    it("Second run, if set different, return new set only", function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([{
            name: "venue name 1",
            address: "address 1"
        },
        {
            name: "venue name 2",
            address: "address 2"  
        }]);

        newVenuesRetriever.Get();

        var newLocation = {
            name: "venue name 3",
            address: "address 3"
        }

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue([newLocation]);

        var updates = newVenuesRetriever.Get();

        expect(updates).toHaveSize(1);
        expect(updates[0]).toBe(newLocation);
    });
  });
      
  
  