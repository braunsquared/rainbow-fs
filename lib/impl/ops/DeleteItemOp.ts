import { AbstractItemOp } from './AbstractItemOp';
import { IItem } from '../../model/Sitecore';
import { IStore } from '../../Store';
import { Bucket } from '../../Bucket';
import debug from 'debug';

const _log = debug('rainbow-fs:op:create');

export class DeleteItemOp extends AbstractItemOp {
  name: string = 'Delete Item';

  constructor(item: IItem) {
    super(item);
  }

  async performCommit(store: IStore, bucket: Bucket) {
    _log(`unlinking item at ${this.item.Path.Path}`);
    await bucket.unlink(this.item);
  }
}
