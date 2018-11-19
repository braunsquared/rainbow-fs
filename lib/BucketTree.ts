import { Bucket } from './Bucket';

export type BucketWalkCallback = (bucket: Bucket) => void;

export class BucketEntry {
  readonly path: string;
  readonly parent: BucketEntry | null;
  readonly bucket: Bucket | null;
  readonly children: Array<BucketEntry>;

  constructor(path: string, parent: BucketEntry | null = null, bucket: Bucket | null = null) {
    this.path = path;
    this.parent = parent;
    this.bucket = bucket;
    this.children = [];
  }

  bucketForFSPath(fsPath: string): Bucket | undefined {
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

  addBucket(path: string, bucket: Bucket): void {
    if(!path) {
      throw new Error('Invalid path. Duplicate bucket path or you failed to pass one');
    }

    const closest = this.closest(path);
    if (closest) {
      return closest.addBucket(path.substring(closest.path.length), bucket);
    }

    // We don't have a closest, so lets figure out where we are remapping our children
    const entry = new BucketEntry(path, this, bucket);
    this.children
      .filter(child => child.path.indexOf(path) === 0)
      .forEach(child => {
        entry.addBucket(child.path.substring(path.length), child.bucket as Bucket)
        this.children.splice(this.children.indexOf(child), 1);
      });
    
    this.children.push(entry);
  }

  closest(path: string): BucketEntry | null {
    const entry = this.children.find(child => path.indexOf(child.path) === 0);
    if (!entry) {
      return null;
    }

    return entry.closest(path.substring(entry.path.length + 1)) || entry;
  }

  walk(cb: BucketWalkCallback) {
    if (this.bucket) {
      cb(this.bucket);
    }

    this.children.forEach(entry => {
      entry.walk(cb);
    });
  }
}

export class BucketTree {
  readonly root: BucketEntry;

  constructor() {
    this.root = new BucketEntry('');
  }

  addBucket(bucket: Bucket) {
    const bucketPath = bucket.Path;
    if (!bucketPath) {
      throw new Error('Bucket must have a path.');
    }

    const existingBucket = this.root.bucketForFSPath(bucket.Filepath);
    if(existingBucket) {
      throw new Error('Duplicate file system path');
    }

    this.root.addBucket(bucketPath.Path, bucket);
  }

  closest(path: string): Bucket | null {
    const closestItem = this.root.closest(path);
    return closestItem ? closestItem.bucket : null;
  }

  walk(cb: BucketWalkCallback) {
    this.root.walk(cb);
  }
}
