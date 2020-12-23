import { LocationRetriever } from "../src/LocationRetriever";

describe("Locations Retriever", function() {

    var locationRetriever : LocationRetriever;
    var downloader:any;

    beforeEach(() => {
        downloader = jasmine.createSpyObj("downloader", ["Download"]);
        locationRetriever = new LocationRetriever(downloader);
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

    it("Retrieves locations", function() {
        downloader.Download.withArgs("http://path.to.url").and.returnValue(downloadedVenues);

        var result = locationRetriever.Get("http://path.to.url");

        expect(result).toHaveSize(2);
        expect(result[0].name).toBe("Monitor Venue 1");
        expect(result[0].address).toBe("Monitor Address 1");
        expect(result[0].suburb).toBe("Suburb1");
        expect(result[0].date).toBe("Tuesday 15 December 2020");
        expect(result[0].time).toBe("2pm to 2:30pm");
        expect(result[0].alert).toBe("Monitor for symptoms");
        expect(result[0].healthAdviceHtml).toBe("Monitor");
        expect(result[0].type).toBe("monitor");

        expect(result[1].name).toBe("Isolate Venue 1");
        expect(result[1].address).toBe("Isolate Address 1");
        expect(result[1].suburb).toBe("Suburb2");
        expect(result[1].date).toBe("Wednesday 16 December 2020");
        expect(result[1].time).toBe("4pm to 4:30pm");
        expect(result[1].alert).toBe("Isolate");
        expect(result[1].healthAdviceHtml).toBe("Isolate");
        expect(result[1].type).toBe("isolate");
    });
});