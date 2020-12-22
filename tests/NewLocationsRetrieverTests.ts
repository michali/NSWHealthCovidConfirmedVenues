
import {NewVenuesRetriever as NewLocationsRetriever} from '../src/NewLocationsRetriever';

describe("New Locations Retriever", function() {

    var metadataRetriever:any;
    var locationRetriever:any;
    var newVenuesRetriever: NewLocationsRetriever; 
    beforeEach(() => {
        metadataRetriever = jasmine.createSpyObj("metadataRetriever", ["Get"]);
        locationRetriever = jasmine.createSpyObj("locationRetriever", ["Get"]);
        newVenuesRetriever = new NewLocationsRetriever(metadataRetriever, locationRetriever);
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
  });
      
  
  