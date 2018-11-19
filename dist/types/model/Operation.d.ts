import { IItem } from './Sitecore';
import { Bucket } from '../Bucket';
export declare type AsyncOperationCallback = (err?: Error | null) => void;
export interface IOperation {
    readonly name: string;
    readonly item: IItem;
    commit(bucket: Bucket, cb?: AsyncOperationCallback): void;
}
//# sourceMappingURL=Operation.d.ts.map