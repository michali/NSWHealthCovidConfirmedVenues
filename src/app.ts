import { Downloader } from "./Downloader";
import { VenueRetriever } from "./VenueRetriever";
import { MetadataRetriever } from "./MetadataRetriever";
import { NewVenuesRetriever } from "./NewVenuesRetriever";
import { TestVenueStorageWrapper } from "./TestVenueStorageWrapper";

var downloader = new Downloader();
var retriever = new NewVenuesRetriever(new MetadataRetriever(downloader, {"metadataEndpointUrl": "https://data.nsw.gov.au/data/api/3/action/package_show?id=0a52e6c1-bc0b-48af-8b45-d791a6d8e289"}),
new VenueRetriever(downloader), new TestVenueStorageWrapper()); 

var venues = retriever.Get();

console.log(venues);