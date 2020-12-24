export interface IStorageWrapper {
    Add<T>(key:string, value:T): void;
    Get<T>(key: string): T | null;
}