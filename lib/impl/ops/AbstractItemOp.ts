import { IOperation } from '../../model/Operation';
import { IItem } from '../../model/Sitecore';
import { IStore } from '../../Store';
import { Bucket } from '../../Bucket';

export abstract class AbstractItemOp implements IOperation {
  name: string = 'Abstract Item Operation';
  committed: boolean = false;
  item: IItem;

  constructor(item: IItem) {
    this.item = item;
  }

  async commit(store: IStore) {
    if (this.committed) {
      throw new Error('Operation already committed');
    }

    const bucket = store.closestBucket(this.item.DB, this.item.Path.Path);
    if (!bucket) {
      throw new Error(`Unabled to commit operation.  No matching bucket found: ${this.item.Path.Path}`);
    }

    await this.performCommit(store, bucket);
    this.committed = true;
  }

  protected abstract performCommit(store: IStore, bucket: Bucket): Promise<void>;
}
