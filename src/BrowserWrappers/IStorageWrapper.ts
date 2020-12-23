export interface IStorageWrapper<T> {
    Add(key:string, value:T): void;
    Get(key: string): T | undefined;
}