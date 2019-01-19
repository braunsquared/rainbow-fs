import { BucketTree } from './BucketTree';
import { Bucket } from './Bucket';
import { IDb, DatabaseFactory } from './model/Database';
import { ItemFactory, IItem, ItemMetaData } from './model/Sitecore';
export declare type IDSource = (objOrItem: any) => string;
export interface IStoreConfig {
    dbFactory: DatabaseFactory;
    itemFactory: ItemFactory;
    idSource: IDSource;
}
export interface IStore {
    readonly config: IStoreConfig;
    addBucket(bucket: Bucket): void;
    closestBucket(db: string, path: string): Bucket | null;
    getDatabase(name: string): IDb | undefined;
    getOrCreateDatabase(name: string): IDb;
    generateId(src: string): string;
    createItemFromObject(obj: any, meta?: ItemMetaData): IItem;
    glob(pattern: string, db?: string | string[]): IItem[];
    readAll(): Promise<any>;
}
export declare const defaultConfig: IStoreConfig;
/**
 * The Store is the root container that ties everything together.  It manages
 * the database, buckets and factories for loading/creating/mutating items in
 * the data store.
 */
export declare class Store implements IStore {
    private _trees;
    private _dbs;
    private _config;
    constructor(config?: IStoreConfig);
    /**
     * @returns The current `Store` configuration
     */
    readonly config: IStoreConfig;
    /**
     * @returns A map of all the root `BucketTree`. One per `IDb` instance keyed on the database name.
     */
    readonly trees: Map<string, BucketTree>;
    /**
     * Get an existing `IDb` instance
     *
     * @param name - The database name
     * @returns The `IDb` instance or undefined
     */
    getDatabase(name: string): IDb | undefined;
    /**
     * Get an existing `IDb` instance or create one using the `dbFactory` if it does not exist.
     *
     * @param name The database name
     * @returns The `IDb` instance
     */
    getOrCreateDatabase(name: string): IDb;
    /**
     * Register a `Bucket` with it's respective database `BucketTree`.
     *
     * @param bucket - The `Bucket` to add
     */
    addBucket(bucket: Bucket): void;
    /**
     * Find a `Bucket` which is closest to 'path' in the requested 'db'.
     *
     * @param db - Name of the db
     * @param path - Sitecore Path
     * @returns the closest `Bucket` or null
     */
    closestBucket(db: string, path: string): Bucket | null;
    /**
     * Create a new `IItem` using the `itemFactory` and register it with it's respective `IDb`
     *
     * @param obj - The deserialized item data as a plain JSON Object.
     * @param meta - Any meta data to associate with the created `IItem`
     */
    createItemFromObject(obj: any, meta?: ItemMetaData): IItem;
    /**
     * Generate a new deterministic GUID using `src` as the seed value.
     *
     * @param src - The source string for the generated GUID
     * @returns A predicatable GUID
     */
    generateId(src: string): string;
    private _globMatch;
    /**
     * Find items in the `Store` which match the Glob pattern.  If no dbs are passed, a match
     * against all the databases is performed.
     *
     * @param pattern - A standard Glob pattern
     * @param dbs - A database name or array of database names to scope the search to
     * @returns An array of `IItem`s containing items that matched the Glob pattern
     */
    glob(pattern: string, dbs?: string | string[]): IItem[];
    /**
     * Perform a `read` call on all registered `Bucket`s
     */
    readAll(): Promise<void>;
    commitAll(): Promise<void>;
}
//# sourceMappingURL=Store.d.ts.map