import { IDownloader } from "./IDownloader";


export class Downloader implements IDownloader {
    Download(url: string): Promise<string> {
        return new Promise(function(resolve, reject){
            var req = new XMLHttpRequest();
            req.open("GET", url, false);            

            req.onload = function(){
                if (req.status == 200){
                    return req.responseText;
                }
            }

            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error " + req.status));
            };
  
            req.send(null);
            resolve(req.responseText);
        });
    }
}
