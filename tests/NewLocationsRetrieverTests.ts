
import {NewVenuesRetriever as NewLocationsRetriever} from '../src/NewLocationsRetriever';

describe("A suite is just a function", function() {

    var metadataRetriever:any;
    var locationRetriever:any;
    var newVenuesRetriever: NewLocationsRetriever; 
    beforeEach(() => {
        metadataRetriever = jasmine.createSpyObj("metadataRetriever", ["Get"]);
        locationRetriever = jasmine.createSpyObj("locationRetriever", ["Get"]);
        newVenuesRetriever = new NewLocationsRetriever(metadataRetriever, locationRetriever);
    });
          
    it("and so is a spec", function() {
      
        metadataRetriever.Get.and.returnValue({
            last_modified: "2020-12-21T02:14:45.944132",
            url: "https://path.to/url"
        });

        locationRetriever.Get.withArgs("https://path.to/url").and.returnValue({
            venue: "venue name 1",
            address: "address 1"
        },
        {
            venue: "venue name 2",
            address: "address 2"
        });

        var updates = newVenuesRetriever.Get();

        expect(updates).toHaveSize(2);
    });
  });
      
  
  