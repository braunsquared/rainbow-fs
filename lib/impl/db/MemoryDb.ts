import { IDb } from '../../model/Database';
import { IItem, GUID, IPath } from '../../model/Sitecore';
import { ItemProxyHandler } from './ItemProxyHandler';
import { IOperation } from '../../model/Operation';
import { CreateItemOp } from '../ops/CreateItemOp';
import { DeleteItemOp } from '../ops/DeleteItemOp';
import { UpdateItemOp } from '../ops/UpdateItemOp';

export function memoryDbFactory(name: string): IDb {
  return new MemoryDb(name);
}

export class MemoryDb implements IDb {
  readonly name: string;
  private _items: Map<GUID, IItem> = new Map<GUID, IItem>();

  private _proxyHandler: ItemProxyHandler;
  private _ops: Array<IOperation>;

  constructor(name: string) {
    this.name = name;
    this._proxyHandler = new ItemProxyHandler(this);
    this._ops = new Array();
  }

  get items(): Map<GUID, IItem> {
    // Don't let outside parties change our item store directly
    return new Map(this._items);
  }

  getItem(id: GUID): IItem | undefined {
    if (id) {
      return this._items.get(id.toLowerCase());
    }
  }

  addItem(item: IItem): IItem {
    if (!item.ID) {
      throw new Error('Items must have an ID to be added to the DB');
    }

    const existing = this.getItem(item.ID);
    if (existing && !existing.Meta.isVirtual) {
      throw new Error(`DB already contains an item with ID [${item.ID}]`);
    }

    // Don't wrap virtual items
    if (!item.Meta.isVirtual) {
      item = this._proxyHandler.wrap(item);

      if (item.Meta.isNew && !item.Meta.isVirtual) {
        this._ops.push(new CreateItemOp(item));
      }
    }

    this._items.set(item.ID!.toLowerCase(), item);

    return item;
  }

  removeItem(item: IItem): IItem {
    if (!item.ID) {
      throw new Error('Items must have an ID to be removed from the DB');
    }

    const lcItemId = item.ID.toLowerCase();

    // Remove all our child items first
    const items = new Map(this._items);
    items.forEach(other => {
      if(other.Parent && other.Parent.toLowerCase() === lcItemId) {
        this.removeItem(item);
      }
    });

    // Remove this item
    this._items.delete(lcItemId);

    // Delete ops trump all others, so lets filter out any existing ops on this item
    this._ops = this._ops.filter(op => op.item !== item);

    // Add the op if it wasn't a new item
    if(!item.Meta.isNew) {
      this._ops.push(new DeleteItemOp(item));
    }

    // Mark the item as dirty in case someone has a reference somewhere
    item.Meta.isDirty = true;

    return item;
  }

  notifyChange(item: IItem, prop: string, oldValue: any, newValue: any) {
    if (!item.Meta.isVirtual && !item.Meta.isNew) {
      if (!item.Meta.isDirty) {
        this._ops.push(new UpdateItemOp(item, prop, oldValue, newValue));
        item.Meta.isDirty = true;
      } else {
        const op = this._ops.find(op => op.item === item && op instanceof UpdateItemOp);
        if(op) {
          (op as UpdateItemOp).recordChange(prop, oldValue, newValue);
        }
      }
    }

    if (prop === 'ID') {
      this._items.delete(oldValue.toLowerCase());
      this._items.set(newValue.toLowerCase(), item);

      this._items.forEach(child => {
        if(child.Parent && child.Parent.toLowerCase() === oldValue) {
          child.Parent = newValue;
        }
      });
    } else if(prop === 'Path') {
      this._items.forEach(child => {
        if(child.Parent === item.ID) {
          child.Path = child.Path.rebase((oldValue as IPath).Path, (newValue as IPath).Path);
        }
      })
    }
  }

  get isDirty(): boolean {
    return this.operationCount() > 0;
  }

  get operations(): Array<IOperation> {
    return [...this._ops];
  }

  operationCount(): number {
    return this._ops.length;
  }
}