import { AbstractItemOp } from './AbstractItemOp';
import { IItem } from '../../model/Sitecore';
import { IStore } from '../../Store';
import { Bucket } from '../../Bucket';
export declare class UpdateItemOp extends AbstractItemOp {
    name: string;
    changed: Map<string, [any, any]>;
    constructor(item: IItem, prop: string, oldValue: any, newValue: any);
    recordChange(prop: string, oldValue: any, newValue: any): void;
    performCommit(store: IStore, bucket: Bucket): Promise<void>;
}
//# sourceMappingURL=UpdateItemOp.d.ts.map