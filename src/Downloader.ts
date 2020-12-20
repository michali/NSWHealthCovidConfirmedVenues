import { IDownloader } from "./IDownloader";


export class Downloader implements IDownloader {
    Download(url: string): string {
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send(null);
        return req.responseText;
    }
}
