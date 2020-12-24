import { VenueRetriever } from "../src/VenueRetriever";

describe("Venue Retriever", function() {

    var venueRetriever : VenueRetriever;
    var downloader:any;

    beforeEach(() => {
        downloader = jasmine.createSpyObj("downloader", ["Download"]);
        venueRetriever = new VenueRetriever(downloader);
    });

    var downloadedVenues = `
    {
        "date": "2020-12-22",
        "title": "Venues",
        "data": {
            "monitor": [
                {
                    "Venue": "Monitor Venue 1",
                    "Address": "Monitor Address 1",
                    "Suburb": "Suburb1",
                    "Date": "Tuesday 15 December 2020",
                    "Time": "2pm to 2:30pm",
                    "Alert": "Monitor for symptoms",
                    "Lon": 1.1,
                    "Lat": 1.1,
                    "HealthAdviceHTML": "Monitor"
                }
            ],
            "negative": [
                {
                    "Venue": "Negative Venue 1",
                    "Address": "Negative Address 1",
                    "Suburb": "Suburb3",
                    "Date": "Thursday 17 December 2020",
                    "Time": "3pm to 3:30pm",
                    "Alert": "Get tested immediately and self isolate until you receive a negative result",
                    "Lon": 1.1,
                    "Lat": 1.1,
                    "HealthAdviceHTML": "Get tested immediately and self isolate until you receive a negative result"
                }
            ],            
            "isolate": [
                {
                    "Venue": "Isolate Venue 1",
                    "Address": "Isolate Address 1",
                    "Suburb": "Suburb2",
                    "Date": "Wednesday 16 December 2020",
                    "Time": "4pm to 4:30pm",
                    "Alert": "Isolate",
                    "Lon": 1.1,
                    "Lat": 1.1,
                    "HealthAdviceHTML": "Isolate"
                }
            ]            
        }
    }
    `;

    it("Retrieves venues", function() {
        downloader.Download.withArgs("http://path.to.url").and.returnValue(downloadedVenues);

        var result = venueRetriever.Get("http://path.to.url");

        expect(result).toHaveSize(3);
        expect(result[0].name).toBe("Monitor Venue 1");
        expect(result[0].address).toBe("Monitor Address 1");
        expect(result[0].suburb).toBe("Suburb1");
        expect(result[0].date).toBe("Tuesday 15 December 2020");
        expect(result[0].time).toBe("2pm to 2:30pm");
        expect(result[0].alert).toBe("Monitor for symptoms");
        expect(result[0].healthAdviceHtml).toBe("Monitor");
        expect(result[0].type).toBe("monitor");

        expect(result[1].name).toBe("Negative Venue 1");
        expect(result[1].address).toBe("Negative Address 1");
        expect(result[1].suburb).toBe("Suburb3");
        expect(result[1].date).toBe("Thursday 17 December 2020");
        expect(result[1].time).toBe("3pm to 3:30pm");
        expect(result[1].alert).toBe("Get tested immediately and self isolate until you receive a negative result");
        expect(result[1].healthAdviceHtml).toBe("Get tested immediately and self isolate until you receive a negative result");
        expect(result[1].type).toBe("test_until_negative");

        expect(result[2].name).toBe("Isolate Venue 1");
        expect(result[2].address).toBe("Isolate Address 1");
        expect(result[2].suburb).toBe("Suburb2");
        expect(result[2].date).toBe("Wednesday 16 December 2020");
        expect(result[2].time).toBe("4pm to 4:30pm");
        expect(result[2].alert).toBe("Isolate");
        expect(result[2].healthAdviceHtml).toBe("Isolate");
        expect(result[2].type).toBe("isolate");
    });
});