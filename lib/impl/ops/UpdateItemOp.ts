import { AbstractItemOp } from './AbstractItemOp';
import { IItem } from '../../model/Sitecore';
import { IStore } from '../../Store';
import { Bucket } from '../../Bucket';
import debug from 'debug';

const _log = debug('rainbow-fs:op:create');

export class UpdateItemOp extends AbstractItemOp {
  name: string = 'Update Item';

  changed: Map<string, [any, any]>;

  constructor(item: IItem, prop: string, oldValue: any, newValue: any) {
    super(item);
    this.changed = new Map<string, [any, any]>([[prop, [oldValue, newValue]]]);
  }

  recordChange(prop: string, oldValue: any, newValue: any) {
    let tuple = this.changed.get(prop);
    if (tuple) {
      tuple = [tuple[0], newValue];
    } else {
      tuple = [oldValue, newValue];
    }

    this.changed.set(prop, tuple);
  }

  async performCommit(store: IStore, bucket: Bucket) {
    _log(`updating item at ${this.item.Path.Path}`);
    await bucket.write(this.item);
  }
}
