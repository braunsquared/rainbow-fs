"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function propertyKeyToString(prop) {
    if (typeof prop === 'number') {
        return `${prop}`;
    }
    else if (typeof prop === 'symbol') {
        return prop.toString();
    }
    else {
        return prop;
    }
}
class ItemProxyHandler {
    constructor(db) {
        this.db = db;
    }
    set(target, prop, value, receiver) {
        const oldValue = Reflect.get(target, prop, receiver);
        if (oldValue !== value) {
            this.db.notifyChange(target, propertyKeyToString(prop), oldValue, value);
        }
        return Reflect.set(target, prop, value, receiver);
    }
    get(target, prop, receiver) {
        const val = Reflect.get(target, prop, receiver);
        if (typeof val === 'function' && typeof prop === 'string' && (prop.startsWith('add') || prop.startsWith('remove'))) {
            return (...args) => {
                this.db.notifyChange(target, prop.replace(/^(add|remove)/, ''), null, null);
                return val.apply(target, args);
            };
        }
        if (prop !== 'Meta' && typeof val === 'object') {
            return new Proxy(val, new ItemAttributeProxyHandler(this, target, propertyKeyToString(prop)));
        }
        return val;
    }
    wrap(item) {
        return new Proxy(item, this);
    }
}
exports.ItemProxyHandler = ItemProxyHandler;
class ItemAttributeProxyHandler {
    constructor(parent, item, path) {
        this.parent = parent;
        this.item = item;
        this.path = path;
    }
    set(target, prop, value, receiver) {
        const oldValue = Reflect.get(target, prop, receiver);
        if (oldValue !== value) {
            this.parent.db.notifyChange(this.item, `${this.path}.${propertyKeyToString(prop)}`, oldValue, value);
        }
        return Reflect.set(target, prop, value, receiver);
    }
    get(target, prop, receiver) {
        const val = Reflect.get(target, prop, receiver);
        // console.log('target', prop, typeof val, val);
        if (typeof val === 'function' && typeof prop === 'string' && (prop.startsWith('add') || prop.startsWith('remove'))) {
            return (...args) => {
                this.parent.db.notifyChange(this.item, `${this.path}.${prop.replace(/^(add|remove)/, '')}`, null, null);
                return val.apply(this, args);
            };
        }
        else if (typeof val === 'object' && val !== null) {
            return new Proxy(val, new ItemAttributeProxyHandler(this.parent, this.item, `${this.path}.${propertyKeyToString(prop)}`));
        }
        return val;
    }
}
//# sourceMappingURL=ItemProxyHandler.js.map