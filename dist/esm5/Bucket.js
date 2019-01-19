"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const js_yaml_1 = tslib_1.__importDefault(require("js-yaml"));
// tslint:disable-next-line:import-name
const path_1 = tslib_1.__importDefault(require("path"));
const glob_1 = tslib_1.__importDefault(require("glob"));
const util_1 = tslib_1.__importDefault(require("util"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const Path_1 = require("./impl/sitecore/Path");
const VirtualItem_1 = require("./impl/sitecore/VirtualItem");
const Sitecore_1 = require("./model/Sitecore");
const YamlWriter_1 = require("./io/YamlWriter");
const _log = debug_1.default('rainbow-fs:bucket');
const readFile = util_1.default.promisify(fs_extra_1.default.readFile);
const mkdirp = util_1.default.promisify(fs_extra_1.default.mkdirp);
const unlink = util_1.default.promisify(fs_extra_1.default.unlink);
const asyncGlob = util_1.default.promisify(glob_1.default);
class Bucket {
    constructor(filepath, sitecorePath, db) {
        this.Filepath = filepath;
        this.Path = new Path_1.Path(sitecorePath);
        this.DB = db;
    }
    convertItemPath(item) {
        const scPath = item.Path;
        const deltaPath = new Path_1.Path(scPath.Folder.substring(this.Path.Folder.length));
        const itemFilePath = path_1.default.join(this.Filepath, deltaPath.Path, `${scPath.Name}.yml`);
        if (itemFilePath.length > 110 && item.Parent) {
            return path_1.default.join(this.Filepath, item.Parent.toLowerCase(), `${scPath.Name}.yml`);
        }
        return itemFilePath;
    }
    read(store) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.Filepath) {
                throw new Error('Filepath is not set. Unable to read from file system.');
            }
            const files = yield asyncGlob(path_1.default.join(this.Filepath, '**/*.yml'));
            for (let i = 0; i < files.length; i = i + 1) {
                const file = files[i];
                const buffer = yield readFile(file);
                const content = js_yaml_1.default.safeLoad(buffer.toString('utf8'), { filename: file });
                const item = store.createItemFromObject(content, {
                    isNew: false,
                    isDirty: false,
                    hints: new Map([[Sitecore_1.HintFilename, file]]),
                });
                if (item.DB !== this.DB) {
                    _log('WARNING: Found item in bucket from different DB');
                    return;
                }
                if (item.Path.Folder === this.Path.Path && item.Parent) {
                    // We may be able to infer some information about our item
                    const db = store.getDatabase(item.DB);
                    if (!db) {
                        throw new Error('Database should not be null');
                    }
                    let bucketItem = db.getItem(item.Parent);
                    if (!bucketItem) {
                        bucketItem = new VirtualItem_1.VirtualItem(item.Parent, this.Path.Path);
                        db.addItem(bucketItem);
                    }
                }
            }
        });
    }
    write(item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (item.Meta.isVirtual) {
                throw new Error('Unable to serialize virtual items');
            }
            else if (!item.Path.Path.startsWith(this.Path.Path)) {
                throw new Error('Item is not a descendant of this bucket');
            }
            else if (item.DB !== this.DB) {
                throw new Error('Item DB does not match the Bucket DB');
            }
            // Figure out what the path should be
            const itemPath = this.convertItemPath(item);
            const basePath = path_1.default.dirname(itemPath);
            _log(`Writing item ${item.ID} to ${itemPath}`);
            yield mkdirp(basePath);
            yield new Promise((resolve, reject) => {
                const stream = fs_extra_1.default.createWriteStream(itemPath, { encoding: 'utf-8' });
                const writer = new YamlWriter_1.YamlWriter(stream);
                item.write(writer);
                stream.end(() => {
                    resolve();
                });
            });
        });
    }
    unlink(item) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (item.Meta.isVirtual) {
                throw new Error('Unable to delete virtual items');
            }
            else if (!item.Path.Path.startsWith(this.Path.Path)) {
                throw new Error('Item is not a descendant of this bucket');
            }
            else if (item.DB !== this.DB) {
                throw new Error('Item DB does not match the Bucket DB');
            }
            const itemPath = this.convertItemPath(item);
            if (fs_extra_1.default.existsSync(itemPath)) {
                yield unlink(itemPath);
            }
        });
    }
}
exports.Bucket = Bucket;
//# sourceMappingURL=Bucket.js.map