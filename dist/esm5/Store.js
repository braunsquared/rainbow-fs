"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var aguid_1 = tslib_1.__importDefault(require("aguid"));
var BucketTree_1 = require("./BucketTree");
var MemoryDb_1 = require("./impl/db/MemoryDb");
var Item_1 = require("./impl/sitecore/Item");
var Path_1 = require("./impl/sitecore/Path");
var minimatch_1 = require("minimatch");
exports.defaultConfig = {
    dbFactory: MemoryDb_1.memoryDbFactory,
    itemFactory: Item_1.defaultItemFactory,
    idSource: function (item) { return item.Path instanceof Path_1.Path ? item.Path.Path : item.Path; },
};
/**
 * The Store is the root container that ties everything together.  It manages
 * the database, buckets and factories for loading/creating/mutating items in
 * the data store.
 */
var Store = /** @class */ (function () {
    function Store(config) {
        if (config === void 0) { config = exports.defaultConfig; }
        this._config = tslib_1.__assign({}, exports.defaultConfig, config);
        this._trees = new Map();
        this._dbs = new Map();
    }
    Object.defineProperty(Store.prototype, "config", {
        /**
         * @returns The current `Store` configuration
         */
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "trees", {
        /**
         * @returns A map of all the root `BucketTree`. One per `IDb` instance keyed on the database name.
         */
        get: function () {
            return this._trees;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get an existing `IDb` instance
     *
     * @param name - The database name
     * @returns The `IDb` instance or undefined
     */
    Store.prototype.getDatabase = function (name) {
        return this._dbs.get(name);
    };
    /**
     * Get an existing `IDb` instance or create one using the `dbFactory` if it does not exist.
     *
     * @param name The database name
     * @returns The `IDb` instance
     */
    Store.prototype.getOrCreateDatabase = function (name) {
        var db = this._dbs.get(name);
        if (!db) {
            db = this._config.dbFactory(name);
            this._dbs.set(name, db);
        }
        return db;
    };
    /**
     * Register a `Bucket` with it's respective database `BucketTree`.
     *
     * @param bucket - The `Bucket` to add
     */
    Store.prototype.addBucket = function (bucket) {
        var tree = this._trees.get(bucket.DB);
        if (!tree) {
            tree = new BucketTree_1.BucketTree();
            this._trees.set(bucket.DB, tree);
        }
        tree.addBucket(bucket);
    };
    /**
     * Create a new `IItem` using the `itemFactory` and register it with it's respective `IDb`
     *
     * @param obj - The deserialized item data as a plain JSON Object.
     * @param meta - Any meta data to associate with the created `IItem`
     */
    Store.prototype.createItemFromObject = function (obj, meta) {
        var item = this.config.itemFactory(this, obj, meta);
        var db = this.getOrCreateDatabase(item.DB);
        return db.addItem(item);
    };
    /**
     * Generate a new deterministic GUID using `src` as the seed value.
     *
     * @param src - The source string for the generated GUID
     * @returns A predicatable GUID
     */
    Store.prototype.generateId = function (src) {
        return aguid_1.default(src);
    };
    Store.prototype._globMatch = function (matcher, dbName) {
        var db = this._dbs.get(dbName);
        if (!db) {
            throw new Error("DB not found: " + dbName);
        }
        var items = [];
        db.items.forEach(function (i) {
            if (matcher.match(i.Path.Path)) {
                items.push(i);
            }
        });
        return items;
    };
    /**
     * Find items in the `Store` which match the Glob pattern.  If no dbs are passed, a match
     * against all the databases is performed.
     *
     * @param pattern - A standard Glob pattern
     * @param dbs - A database name or array of database names to scope the search to
     * @returns An array of `IItem`s containing items that matched the Glob pattern
     */
    Store.prototype.glob = function (pattern, dbs) {
        var results = [];
        var matcher = new minimatch_1.Minimatch(pattern, { nocase: true });
        var dbsToTest;
        if (!dbs) {
            dbsToTest = Array.from(this._dbs.keys());
        }
        else {
            dbsToTest = Array.isArray(dbs) ? dbs : [dbs];
        }
        for (var i = 0; i < dbsToTest.length; ++i) {
            results.splice.apply(results, [results.length, 0].concat(this._globMatch(matcher, dbsToTest[i])));
        }
        return results;
    };
    /**
     * Perform a `read` call on all registered `Bucket`s
     */
    Store.prototype.readAll = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        this._trees.forEach(function (tree) {
                            tree.walk(function (bucket) {
                                promises.push(bucket.read(_this));
                            });
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Store;
}());
exports.Store = Store;
//# sourceMappingURL=Store.js.map