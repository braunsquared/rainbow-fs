import { IOperation, AsyncOperationCallback } from '../../model/Operation';
import { IItem } from '../../model/Sitecore';
import { Bucket } from '../../Bucket';

export class UpdateItemOp implements IOperation {
  name: string = "Update Item"; 
  item: IItem;

  changed: Map<string, [any, any]>;

  constructor(item: IItem, prop: string, oldValue: any, newValue: any) {
    this.item = item;
    this.changed = new Map<string, [any, any]>([[prop, [oldValue, newValue]]]);
  }

  recordChange(prop: string, oldValue: any, newValue: any) {
    let tuple = this.changed.get(prop);
    if(tuple) {
      tuple = [tuple[0], newValue];
    } else {
      tuple = [oldValue, newValue];
    }

    this.changed.set(prop, tuple);
  }
  
  commit(bucket: Bucket, cb?: AsyncOperationCallback): void {
    throw new Error('Method not implemented.');
  }
}