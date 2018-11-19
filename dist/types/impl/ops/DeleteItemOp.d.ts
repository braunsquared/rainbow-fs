import { IOperation, AsyncOperationCallback } from '../../model/Operation';
import { IItem } from '../../model/Sitecore';
import { Bucket } from '../../Bucket';
export declare class DeleteItemOp implements IOperation {
    name: string;
    item: IItem;
    constructor(item: IItem);
    commit(bucket: Bucket, cb?: AsyncOperationCallback): void;
}
//# sourceMappingURL=DeleteItemOp.d.ts.map