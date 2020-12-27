export interface IDownloader{
    Download(url:string):Promise<string>;
}