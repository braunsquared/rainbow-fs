import { IOperation } from '../../model/Operation';
import { IItem } from '../../model/Sitecore';
import { IStore } from '../../Store';
import { Bucket } from '../../Bucket';
export declare abstract class AbstractItemOp implements IOperation {
    name: string;
    committed: boolean;
    item: IItem;
    constructor(item: IItem);
    commit(store: IStore): Promise<void>;
    protected abstract performCommit(store: IStore, bucket: Bucket): Promise<void>;
}
//# sourceMappingURL=AbstractItemOp.d.ts.map