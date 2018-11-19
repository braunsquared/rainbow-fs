"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var js_yaml_1 = tslib_1.__importDefault(require("js-yaml"));
var path_1 = tslib_1.__importDefault(require("path"));
var glob_1 = tslib_1.__importDefault(require("glob"));
var util_1 = tslib_1.__importDefault(require("util"));
var Path_1 = require("./impl/sitecore/Path");
var VirtualItem_1 = require("./impl/sitecore/VirtualItem");
var Sitecore_1 = require("./model/Sitecore");
var readFile = util_1.default.promisify(fs_extra_1.default.readFile);
var writeFile = util_1.default.promisify(fs_extra_1.default.writeFile);
var mkdirp = util_1.default.promisify(fs_extra_1.default.mkdirp);
var asyncGlob = util_1.default.promisify(glob_1.default);
var Bucket = /** @class */ (function () {
    function Bucket(filepath, sitecorePath, db) {
        this.Filepath = filepath;
        this.Path = new Path_1.Path(sitecorePath);
        this.DB = db;
    }
    Bucket.prototype.convertItemPath = function (scPath) {
        var deltaPath = new Path_1.Path(scPath.Folder.substring(this.Path.Path.length));
        return path_1.default.join(this.Filepath, deltaPath.Path, scPath.Name + ".yml");
    };
    Bucket.prototype.read = function (store) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var files, i, file, buffer, content, item, db, bucketItem;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.Filepath) {
                            throw new Error("Filepath is not set. Unable to read from file system.");
                        }
                        return [4 /*yield*/, asyncGlob(path_1.default.join(this.Filepath, '**/*.yml'))];
                    case 1:
                        files = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < files.length)) return [3 /*break*/, 5];
                        file = files[i];
                        return [4 /*yield*/, readFile(file)];
                    case 3:
                        buffer = _a.sent();
                        content = js_yaml_1.default.safeLoad(buffer.toString('utf8'), { filename: file });
                        item = store.createItemFromObject(content, {
                            isNew: false,
                            isDirty: false,
                            hints: new Map([[Sitecore_1.HintFilename, file]]),
                        });
                        if (item.DB !== this.DB) {
                            console.warn('Found item in bucket from different DB');
                            return [2 /*return*/];
                        }
                        if (item.Path.Folder === this.Path.Path && item.Parent) {
                            db = store.getDatabase(item.DB);
                            if (!db) {
                                throw new Error('Database should not be null');
                            }
                            bucketItem = db.getItem(item.Parent);
                            if (!bucketItem) {
                                bucketItem = new VirtualItem_1.VirtualItem(item.Parent, this.Path.Path);
                                db.addItem(bucketItem);
                            }
                        }
                        _a.label = 4;
                    case 4:
                        ++i;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Bucket.prototype.write = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var itemPath, basePath;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (item.Meta.isVirtual) {
                            throw new Error('Unable to serialize virtual items');
                        }
                        else if (!item.Path.Path.startsWith(this.Path.Path)) {
                            throw new Error('Item is not a descendant of this bucket');
                        }
                        else if (item.DB !== this.DB) {
                            throw new Error('Item DB does not match the Bucket DB');
                        }
                        itemPath = this.convertItemPath(item.Path);
                        basePath = path_1.default.dirname(itemPath);
                        return [4 /*yield*/, mkdirp(basePath)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, writeFile(itemPath, js_yaml_1.default.safeDump(item.toObject()))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Bucket;
}());
exports.Bucket = Bucket;
//# sourceMappingURL=Bucket.js.map