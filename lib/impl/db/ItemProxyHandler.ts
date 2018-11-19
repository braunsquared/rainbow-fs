import { IItem } from '../../model/Sitecore';
import { IDb } from '../../model/Database';

function propertyKeyToString(prop: PropertyKey): string {
  if(typeof prop === 'number') {
    return `${prop}`;
  } else if(typeof prop === 'symbol') {
    return prop.toString();
  } else {
    return prop;
  }
}

export class ItemProxyHandler implements ProxyHandler<IItem> {
  db: IDb;

  constructor(db: IDb) {
    this.db = db;
  }

  set(target: IItem, prop: PropertyKey, value: any, receiver?: any): boolean {
    const oldValue = Reflect.get(target, prop, receiver);
    if(oldValue !== value) {
      this.db.notifyChange(target, propertyKeyToString(prop), oldValue, value);
    }

    return Reflect.set(target, prop, value, receiver);
  }

  get(target: IItem, prop: PropertyKey, receiver?: any): any {
    const val = Reflect.get(target, prop, receiver);
    if(typeof val === 'function' && typeof prop === 'string' && (prop.startsWith('add') || prop.startsWith('remove'))) {
      return (...args: any[]): any => {
        this.db.notifyChange(target, prop.replace(/^(add|remove)/, ''), null, null);
        return val.apply(this, args);
      }
    } else if(prop !== 'Meta' && typeof val === 'object') {
      return new Proxy(val, new ItemAttributeProxyHandler(this, target, propertyKeyToString(prop)));
    }

    return val;
  }

  wrap(item: IItem): IItem {
    return new Proxy<IItem>(item, this);
  }
}

class ItemAttributeProxyHandler implements ProxyHandler<any> {
  parent: ItemProxyHandler;
  item: IItem;
  path: string;
  
  constructor(parent: ItemProxyHandler, item: IItem, path: string) {
    this.parent = parent;
    this.item = item;
    this.path = path;
  }

  set(target: any, prop: PropertyKey, value: any, receiver?: any): boolean {
    const oldValue = Reflect.get(target, prop, receiver);
    if(oldValue !== value) {
      this.parent.db.notifyChange(this.item, `${this.path}.${propertyKeyToString(prop)}`, oldValue, value);
    }

    return Reflect.set(target, prop, value, receiver);
  }

  get(target: any, prop: PropertyKey, receiver?: any): any {
    const val = Reflect.get(target, prop, receiver);
    // console.log('target', prop, typeof val, val);
    if(typeof val === 'function' && typeof prop === 'string' && (prop.startsWith('add') || prop.startsWith('remove'))) {
      return (...args: any[]): any => {
        this.parent.db.notifyChange(this.item, `${this.path}.${prop.replace(/^(add|remove)/, '')}`, null, null);
        return val.apply(this, args);
      }
    } else if(typeof val === 'object' && val !== null) {
      return new Proxy(val, new ItemAttributeProxyHandler(this.parent, this.item, `${this.path}.${propertyKeyToString(prop)}`));
    }
    return val;
  }
}
