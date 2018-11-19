import { IOperation, AsyncOperationCallback } from '../../model/Operation';
import { IItem } from '../../model/Sitecore';
import { Bucket } from '../../Bucket';
export declare class CreateItemOp implements IOperation {
    name: string;
    item: IItem;
    constructor(item: IItem);
    commit(bucket: Bucket, cb?: AsyncOperationCallback): void;
}
//# sourceMappingURL=CreateItemOp.d.ts.map