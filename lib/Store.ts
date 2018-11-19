import aguid from 'aguid';
import { BucketTree } from './BucketTree';
import { Bucket } from './Bucket';

import { IDb, DatabaseFactory } from './model/Database';
import { ItemFactory, IItem, ItemMetaData } from './model/Sitecore';
import { memoryDbFactory } from './impl/db/MemoryDb';
import { defaultItemFactory } from './impl/sitecore/Item';
import { Path } from './impl/sitecore/Path';
import { Minimatch, IMinimatch } from 'minimatch';

export type IDSource = (objOrItem: any) => string;

export interface IStoreConfig {
  dbFactory: DatabaseFactory;
  itemFactory: ItemFactory;
  idSource: IDSource;
}

export interface IStore {
  readonly config: IStoreConfig;

  addBucket(bucket: Bucket): void;

  getDatabase(name: string): IDb | undefined;
  getOrCreateDatabase(name: string): IDb;

  generateId(src: string): string;
  createItemFromObject(obj: any, meta?: ItemMetaData): IItem;

  glob(pattern: string, db?: string | string[]): IItem[];

  readAll(): Promise<any>;
}

export const defaultConfig: IStoreConfig = {
  dbFactory: memoryDbFactory,
  itemFactory: defaultItemFactory,
  idSource: item => item.Path instanceof Path ? item.Path.Path : item.Path,
}

/**
 * The Store is the root container that ties everything together.  It manages
 * the database, buckets and factories for loading/creating/mutating items in
 * the data store.
 */
export class Store implements IStore {
  private _trees: Map<string, BucketTree>;
  private _dbs: Map<string, IDb>;
  private _config: IStoreConfig;

  constructor(config: IStoreConfig = defaultConfig) {
    this._config = {...defaultConfig, ...config};

    this._trees = new Map();
    this._dbs = new Map();
  }

  /**
   * @returns The current `Store` configuration
   */
  get config() {
    return this._config;
  }

  /**
   * @returns A map of all the root `BucketTree`. One per `IDb` instance keyed on the database name.
   */
  get trees() {
    return this._trees;
  }

  /**
   * Get an existing `IDb` instance
   * 
   * @param name - The database name
   * @returns The `IDb` instance or undefined
   */
  getDatabase(name: string): IDb | undefined {
    return this._dbs.get(name);
  }

  /**
   * Get an existing `IDb` instance or create one using the `dbFactory` if it does not exist.
   * 
   * @param name The database name
   * @returns The `IDb` instance
   */
  getOrCreateDatabase(name: string): IDb {
    let db = this._dbs.get(name);
    if(!db) {
      db = this._config.dbFactory(name);
      this._dbs.set(name, db);
    }
    return db;
  }

  /**
   * Register a `Bucket` with it's respective database `BucketTree`.
   * 
   * @param bucket - The `Bucket` to add
   */
  addBucket(bucket: Bucket): void {
    let tree = this._trees.get(bucket.DB);
    if (!tree) {
      tree = new BucketTree();
      this._trees.set(bucket.DB, tree);
    }
    tree.addBucket(bucket);
  }

  /**
   * Create a new `IItem` using the `itemFactory` and register it with it's respective `IDb`
   * 
   * @param obj - The deserialized item data as a plain JSON Object.
   * @param meta - Any meta data to associate with the created `IItem`
   */
  createItemFromObject(obj: any, meta?: ItemMetaData): IItem {
    const item = this.config.itemFactory(this, obj, meta);
    const db = this.getOrCreateDatabase(item.DB);
    return db.addItem(item);
  }

  /**
   * Generate a new deterministic GUID using `src` as the seed value.
   * 
   * @param src - The source string for the generated GUID
   * @returns A predicatable GUID
   */
  generateId(src: string): string {
    return aguid(src);
  }

  private _globMatch(matcher: IMinimatch, dbName: string): IItem[] {
    const db = this._dbs.get(dbName);
    if (!db) {
      throw new Error(`DB not found: ${dbName}`);
    }

    const items: IItem[] = [];
    db.items.forEach(i => {
      if (matcher.match(i.Path.Path)) {
        items.push(i);
      }
    });

    return items;
  }

  /**
   * Find items in the `Store` which match the Glob pattern.  If no dbs are passed, a match
   * against all the databases is performed.
   * 
   * @param pattern - A standard Glob pattern
   * @param dbs - A database name or array of database names to scope the search to
   * @returns An array of `IItem`s containing items that matched the Glob pattern
   */
  glob(pattern: string, dbs?: string | string[]): IItem[] {
    const results: IItem[] = [];
    const matcher = new Minimatch(pattern, { nocase: true });

    let dbsToTest;

    if (!dbs) {
      dbsToTest = Array.from(this._dbs.keys());
    } else {
      dbsToTest = Array.isArray(dbs) ? dbs : [dbs];
    }

    for(let i = 0; i < dbsToTest.length; ++i) {
      results.splice(results.length, 0, ...this._globMatch(matcher, dbsToTest[i]));
    }

    return results;
  }

  /**
   * Perform a `read` call on all registered `Bucket`s
   */
  async readAll() {
    const promises: Promise<any>[] = [];
    this._trees.forEach(tree => {
      tree.walk(bucket => {
        promises.push(bucket.read(this));
      });
    });
    await Promise.all(promises);
  }
}