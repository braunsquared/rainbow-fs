"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BucketEntry = /** @class */ (function () {
    function BucketEntry(path, parent, bucket) {
        if (parent === void 0) { parent = null; }
        if (bucket === void 0) { bucket = null; }
        this.path = path;
        this.parent = parent;
        this.bucket = bucket;
        this.children = [];
    }
    BucketEntry.prototype.bucketForFSPath = function (fsPath) {
        if (this.bucket && this.bucket.Filepath === fsPath) {
            return this.bucket;
        }
        var childBucket;
        this.children.find(function (c) {
            childBucket = c.bucketForFSPath(fsPath);
            return !!childBucket;
        });
        return childBucket;
    };
    BucketEntry.prototype.addBucket = function (path, bucket) {
        var _this = this;
        if (!path) {
            throw new Error('Invalid path. Duplicate bucket path or you failed to pass one');
        }
        var closest = this.closest(path);
        if (closest) {
            return closest.addBucket(path.substring(closest.path.length), bucket);
        }
        // We don't have a closest, so lets figure out where we are remapping our children
        var entry = new BucketEntry(path, this, bucket);
        this.children
            .filter(function (child) { return child.path.indexOf(path) === 0; })
            .forEach(function (child) {
            entry.addBucket(child.path.substring(path.length), child.bucket);
            _this.children.splice(_this.children.indexOf(child), 1);
        });
        this.children.push(entry);
    };
    BucketEntry.prototype.closest = function (path) {
        var entry = this.children.find(function (child) { return path.indexOf(child.path) === 0; });
        if (!entry) {
            return null;
        }
        return entry.closest(path.substring(entry.path.length + 1)) || entry;
    };
    BucketEntry.prototype.walk = function (cb) {
        if (this.bucket) {
            cb(this.bucket);
        }
        this.children.forEach(function (entry) {
            entry.walk(cb);
        });
    };
    return BucketEntry;
}());
exports.BucketEntry = BucketEntry;
var BucketTree = /** @class */ (function () {
    function BucketTree() {
        this.root = new BucketEntry('');
    }
    BucketTree.prototype.addBucket = function (bucket) {
        var bucketPath = bucket.Path;
        if (!bucketPath) {
            throw new Error('Bucket must have a path.');
        }
        var existingBucket = this.root.bucketForFSPath(bucket.Filepath);
        if (existingBucket) {
            throw new Error('Duplicate file system path');
        }
        this.root.addBucket(bucketPath.Path, bucket);
    };
    BucketTree.prototype.closest = function (path) {
        var closestItem = this.root.closest(path);
        return closestItem ? closestItem.bucket : null;
    };
    BucketTree.prototype.walk = function (cb) {
        this.root.walk(cb);
    };
    return BucketTree;
}());
exports.BucketTree = BucketTree;
//# sourceMappingURL=BucketTree.js.map