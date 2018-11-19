import { Bucket } from './Bucket';
export declare type BucketWalkCallback = (bucket: Bucket) => void;
export declare class BucketEntry {
    readonly path: string;
    readonly parent: BucketEntry | null;
    readonly bucket: Bucket | null;
    readonly children: Array<BucketEntry>;
    constructor(path: string, parent?: BucketEntry | null, bucket?: Bucket | null);
    bucketForFSPath(fsPath: string): Bucket | undefined;
    addBucket(path: string, bucket: Bucket): void;
    closest(path: string): BucketEntry | null;
    walk(cb: BucketWalkCallback): void;
}
export declare class BucketTree {
    readonly root: BucketEntry;
    constructor();
    addBucket(bucket: Bucket): void;
    closest(path: string): Bucket | null;
    walk(cb: BucketWalkCallback): void;
}
//# sourceMappingURL=BucketTree.d.ts.map