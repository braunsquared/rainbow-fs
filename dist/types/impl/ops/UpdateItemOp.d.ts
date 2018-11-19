import { IOperation, AsyncOperationCallback } from '../../model/Operation';
import { IItem } from '../../model/Sitecore';
import { Bucket } from '../../Bucket';
export declare class UpdateItemOp implements IOperation {
    name: string;
    item: IItem;
    changed: Map<string, [any, any]>;
    constructor(item: IItem, prop: string, oldValue: any, newValue: any);
    recordChange(prop: string, oldValue: any, newValue: any): void;
    commit(bucket: Bucket, cb?: AsyncOperationCallback): void;
}
//# sourceMappingURL=UpdateItemOp.d.ts.map