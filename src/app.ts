import { Downloader } from "./Downloader";
import { LocationRetriever } from "./LocationRetriever";
import { MetadataRetriever } from "./MetadataRetriever";
import { NewLocationsRetriever } from "./NewLocationsRetriever";
import { IStorageWrapper} from "./BrowserWrappers/IStorageWrapper";
import { Location} from "./Location";

class TestLocationStorageWrapper implements IStorageWrapper<Location[]>{

    private _store:Map<string, Location[]> = new Map<string, Location[]>();

    Add(key: string, value: Location[]): void {
        this._store.set(key, value);
    }
    
    Get(key: string):Location[] | undefined {
        return this._store.get(key);       
    }
}

var downloader = new Downloader();
var retriever = new NewLocationsRetriever(new MetadataRetriever(downloader, {"metadataEndpointUrl": "https://data.nsw.gov.au/data/api/3/action/package_show?id=0a52e6c1-bc0b-48af-8b45-d791a6d8e289"}),
new LocationRetriever(downloader), new TestLocationStorageWrapper()); 

var locations = retriever.Get();

console.log(locations);