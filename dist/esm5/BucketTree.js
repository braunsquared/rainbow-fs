"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BucketEntry {
    constructor(path, parent = null, bucket = null) {
        this.path = path;
        this.parent = parent;
        this.bucket = bucket;
        this.children = [];
    }
    bucketForFSPath(fsPath) {
        if (this.bucket && this.bucket.Filepath === fsPath) {
            return this.bucket;
        }
        let childBucket;
        this.children.find(c => {
            childBucket = c.bucketForFSPath(fsPath);
            return !!childBucket;
        });
        return childBucket;
    }
    addBucket(path, bucket) {
        if (!path) {
            throw new Error('Invalid path. Duplicate bucket path or you failed to pass one');
        }
        const closest = this.closest(path, false);
        if (closest) {
            return closest.addBucket(path.substring(closest.path.length), bucket);
        }
        // We don't have a closest, so lets figure out where we are remapping our children
        const entry = new BucketEntry(path, this, bucket);
        this.children
            .filter(child => child.path.indexOf(path) === 0)
            .forEach(child => {
            entry.addBucket(child.path.substring(path.length), child.bucket);
            this.children.splice(this.children.indexOf(child), 1);
        });
        this.children.push(entry);
    }
    closest(path, deep = true) {
        const lcPath = path.toLowerCase();
        const entry = this.children.find(child => lcPath.indexOf(child.path.toLowerCase()) === 0);
        // console.log('closest', `[${path}]`, entry ? `\nChildren:\n${entry.children.map(c => c.path).join('\n')}\n` : 'null');
        if (!entry) {
            return null;
        }
        if (!deep) {
            return entry;
        }
        return entry.closest(path.substring(entry.path.length)) || entry;
    }
    walk(cb) {
        if (this.bucket) {
            cb(this.bucket);
        }
        this.children.forEach(entry => {
            entry.walk(cb);
        });
    }
}
exports.BucketEntry = BucketEntry;
class BucketTree {
    constructor() {
        this.root = new BucketEntry('');
    }
    addBucket(bucket) {
        const bucketPath = bucket.Path;
        if (!bucketPath) {
            throw new Error('Bucket must have a path.');
        }
        const existingBucket = this.root.bucketForFSPath(bucket.Filepath);
        if (existingBucket) {
            throw new Error('Duplicate file system path');
        }
        this.root.addBucket(bucketPath.Path, bucket);
    }
    closest(path) {
        const closestItem = this.root.closest(path);
        return closestItem ? closestItem.bucket : null;
    }
    walk(cb) {
        this.root.walk(cb);
    }
}
exports.BucketTree = BucketTree;
//# sourceMappingURL=BucketTree.js.map