import { AbstractItemOp } from './AbstractItemOp';
import { IItem } from '../../model/Sitecore';
import { IStore } from '../../Store';
import { Bucket } from '../../Bucket';
export declare class CreateItemOp extends AbstractItemOp {
    name: string;
    constructor(item: IItem);
    performCommit(store: IStore, bucket: Bucket): Promise<void>;
}
//# sourceMappingURL=CreateItemOp.d.ts.map