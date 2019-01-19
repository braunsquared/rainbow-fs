import { AbstractItemOp } from './AbstractItemOp';
import { IItem } from '../../model/Sitecore';
import { IStore } from '../../Store';
import { Bucket } from '../../Bucket';
export declare class DeleteItemOp extends AbstractItemOp {
    name: string;
    constructor(item: IItem);
    performCommit(store: IStore, bucket: Bucket): Promise<void>;
}
//# sourceMappingURL=DeleteItemOp.d.ts.map