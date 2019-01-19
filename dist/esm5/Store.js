"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const aguid_1 = tslib_1.__importDefault(require("aguid"));
const BucketTree_1 = require("./BucketTree");
const MemoryDb_1 = require("./impl/db/MemoryDb");
const Item_1 = require("./impl/sitecore/Item");
const Path_1 = require("./impl/sitecore/Path");
const minimatch_1 = require("minimatch");
const debug_1 = tslib_1.__importDefault(require("debug"));
const _log = debug_1.default('rainbow-fs:store');
exports.defaultConfig = {
    dbFactory: MemoryDb_1.memoryDbFactory,
    itemFactory: Item_1.defaultItemFactory,
    idSource: item => item.Path instanceof Path_1.Path ? item.Path.Path : item.Path,
};
/**
 * The Store is the root container that ties everything together.  It manages
 * the database, buckets and factories for loading/creating/mutating items in
 * the data store.
 */
class Store {
    constructor(config = exports.defaultConfig) {
        this._config = Object.assign({}, exports.defaultConfig, config);
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
    getDatabase(name) {
        return this._dbs.get(name);
    }
    /**
     * Get an existing `IDb` instance or create one using the `dbFactory` if it does not exist.
     *
     * @param name The database name
     * @returns The `IDb` instance
     */
    getOrCreateDatabase(name) {
        let db = this._dbs.get(name);
        if (!db) {
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
    addBucket(bucket) {
        let tree = this._trees.get(bucket.DB);
        if (!tree) {
            tree = new BucketTree_1.BucketTree();
            this._trees.set(bucket.DB, tree);
        }
        tree.addBucket(bucket);
    }
    /**
     * Find a `Bucket` which is closest to 'path' in the requested 'db'.
     *
     * @param db - Name of the db
     * @param path - Sitecore Path
     * @returns the closest `Bucket` or null
     */
    closestBucket(db, path) {
        const tree = this._trees.get(db);
        if (!tree) {
            return null;
        }
        return tree.closest(path);
    }
    /**
     * Create a new `IItem` using the `itemFactory` and register it with it's respective `IDb`
     *
     * @param obj - The deserialized item data as a plain JSON Object.
     * @param meta - Any meta data to associate with the created `IItem`
     */
    createItemFromObject(obj, meta) {
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
    generateId(src) {
        return aguid_1.default(src);
    }
    // tslint:disable-next-line:function-name
    _globMatch(matcher, dbName) {
        const db = this._dbs.get(dbName);
        if (!db) {
            throw new Error(`DB not found: ${dbName}`);
        }
        const items = [];
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
    glob(pattern, dbs) {
        const results = [];
        const matcher = new minimatch_1.Minimatch(pattern, { nocase: true });
        let dbsToTest;
        if (!dbs) {
            dbsToTest = Array.from(this._dbs.keys());
        }
        else {
            dbsToTest = Array.isArray(dbs) ? dbs : [dbs];
        }
        for (let i = 0; i < dbsToTest.length; i = i + 1) {
            results.splice(results.length, 0, ...this._globMatch(matcher, dbsToTest[i]));
        }
        return results;
    }
    /**
     * Perform a `read` call on all registered `Bucket`s
     */
    readAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const promises = [];
            this._trees.forEach(tree => {
                tree.walk(bucket => {
                    promises.push(bucket.read(this));
                });
            });
            yield Promise.all(promises);
        });
    }
    commitAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const dbs = Array.from(this._dbs.values());
            for (let i = 0; i < dbs.length; i = i + 1) {
                _log(`Committing operations on DB [${dbs[i].name}]`);
                yield dbs[i].commit(this);
            }
        });
    }
}
exports.Store = Store;
//# sourceMappingURL=Store.js.map