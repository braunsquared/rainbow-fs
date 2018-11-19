"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function propertyKeyToString(prop) {
    if (typeof prop === 'number') {
        return "" + prop;
    }
    else if (typeof prop === 'symbol') {
        return prop.toString();
    }
    else {
        return prop;
    }
}
var ItemProxyHandler = /** @class */ (function () {
    function ItemProxyHandler(db) {
        this.db = db;
    }
    ItemProxyHandler.prototype.set = function (target, prop, value, receiver) {
        var oldValue = Reflect.get(target, prop, receiver);
        if (oldValue !== value) {
            this.db.notifyChange(target, propertyKeyToString(prop), oldValue, value);
        }
        return Reflect.set(target, prop, value, receiver);
    };
    ItemProxyHandler.prototype.get = function (target, prop, receiver) {
        var _this = this;
        var val = Reflect.get(target, prop, receiver);
        if (typeof val === 'function' && typeof prop === 'string' && (prop.startsWith('add') || prop.startsWith('remove'))) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.db.notifyChange(target, prop.replace(/^(add|remove)/, ''), null, null);
                return val.apply(_this, args);
            };
        }
        else if (prop !== 'Meta' && typeof val === 'object') {
            return new Proxy(val, new ItemAttributeProxyHandler(this, target, propertyKeyToString(prop)));
        }
        return val;
    };
    ItemProxyHandler.prototype.wrap = function (item) {
        return new Proxy(item, this);
    };
    return ItemProxyHandler;
}());
exports.ItemProxyHandler = ItemProxyHandler;
var ItemAttributeProxyHandler = /** @class */ (function () {
    function ItemAttributeProxyHandler(parent, item, path) {
        this.parent = parent;
        this.item = item;
        this.path = path;
    }
    ItemAttributeProxyHandler.prototype.set = function (target, prop, value, receiver) {
        var oldValue = Reflect.get(target, prop, receiver);
        if (oldValue !== value) {
            this.parent.db.notifyChange(this.item, this.path + "." + propertyKeyToString(prop), oldValue, value);
        }
        return Reflect.set(target, prop, value, receiver);
    };
    ItemAttributeProxyHandler.prototype.get = function (target, prop, receiver) {
        var _this = this;
        var val = Reflect.get(target, prop, receiver);
        // console.log('target', prop, typeof val, val);
        if (typeof val === 'function' && typeof prop === 'string' && (prop.startsWith('add') || prop.startsWith('remove'))) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.parent.db.notifyChange(_this.item, _this.path + "." + prop.replace(/^(add|remove)/, ''), null, null);
                return val.apply(_this, args);
            };
        }
        else if (typeof val === 'object' && val !== null) {
            return new Proxy(val, new ItemAttributeProxyHandler(this.parent, this.item, this.path + "." + propertyKeyToString(prop)));
        }
        return val;
    };
    return ItemAttributeProxyHandler;
}());
//# sourceMappingURL=ItemProxyHandler.js.map