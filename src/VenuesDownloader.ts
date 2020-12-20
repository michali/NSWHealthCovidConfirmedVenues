class VenuesDownloader
{
    metadataEndpoint: string = "https://data.nsw.gov.au/data/api/3/action/package_show?id=0a52e6c1-bc0b-48af-8b45-d791a6d8e289";

    Get(): VenuesMetadata {
        var req = new XMLHttpRequest();
        req.open("GET", this.metadataEndpoint, false);
        req.send(null);
        var data = req.responseText; 
        var jsonObj = JSON.parse(data);        
        var venuesMetadata:VenuesMetadata = jsonObj.result.resources.filter((x:any) => x.name.toLowerCase().includes("current case"))[0];
        return venuesMetadata;
    }
}