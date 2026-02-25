export declare const ERROR_SAVE_DATA_MESSAGE = "Error saving data to storage. Message:";
export declare const ERROR_LOAD_DATA_MESSAGE = "Error getting data from storage. Message:";
export declare class JetsStorageService {
    private cache;
    /** Hydrate the in-memory cache from AsyncStorage. Call once at startup. */
    init(): Promise<void>;
    /** Synchronous read from in-memory cache. */
    getData(key: string): string | null;
    /** Synchronous write to in-memory cache + async persist. */
    setData(key: string, value: string, ttl?: number): boolean;
    removeData(key: string): void;
}
//# sourceMappingURL=storage.d.ts.map