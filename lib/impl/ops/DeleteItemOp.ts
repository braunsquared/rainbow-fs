import { IOperation, AsyncOperationCallback } from '../../model/Operation';
import { IItem } from '../../model/Sitecore';
import { Bucket } from '../../Bucket';

export class DeleteItemOp implements IOperation {
  name: string = "Delete Item"; 
  item: IItem;

  constructor(item: IItem) {
    this.item = item;
  }
  
  commit(bucket: Bucket, cb?: AsyncOperationCallback): void {
    throw new Error('Method not implemented.');
  }
}