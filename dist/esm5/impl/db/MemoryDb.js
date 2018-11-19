"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ItemProxyHandler_1 = require("./ItemProxyHandler");
var CreateItemOp_1 = require("../ops/CreateItemOp");
var DeleteItemOp_1 = require("../ops/DeleteItemOp");
var UpdateItemOp_1 = require("../ops/UpdateItemOp");
function memoryDbFactory(name) {
    return new MemoryDb(name);
}
exports.memoryDbFactory = memoryDbFactory;
var MemoryDb = /** @class */ (function () {
    function MemoryDb(name) {
        this._items = new Map();
        this.name = name;
        this._proxyHandler = new ItemProxyHandler_1.ItemProxyHandler(this);
        this._ops = new Array();
    }
    Object.defineProperty(MemoryDb.prototype, "items", {
        get: function () {
            // Don't let outside parties change our item store directly
            return new Map(this._items);
        },
        enumerable: true,
        configurable: true
    });
    MemoryDb.prototype.getItem = function (id) {
        if (id) {
            return this._items.get(id.toLowerCase());
        }
    };
    MemoryDb.prototype.addItem = function (item) {
        if (!item.ID) {
            throw new Error('Items must have an ID to be added to the DB');
        }
        var existing = this.getItem(item.ID);
        if (existing && !existing.Meta.isVirtual) {
            throw new Error("DB already contains an item with ID [" + item.ID + "]");
        }
        // Don't wrap virtual items
        if (!item.Meta.isVirtual) {
            item = this._proxyHandler.wrap(item);
            if (item.Meta.isNew && !item.Meta.isVirtual) {
                this._ops.push(new CreateItemOp_1.CreateItemOp(item));
            }
        }
        this._items.set(item.ID.toLowerCase(), item);
        return item;
    };
    MemoryDb.prototype.removeItem = function (item) {
        var _this = this;
        if (!item.ID) {
            throw new Error('Items must have an ID to be removed from the DB');
        }
        var lcItemId = item.ID.toLowerCase();
        // Remove all our child items first
        var items = new Map(this._items);
        items.forEach(function (other) {
            if (other.Parent && other.Parent.toLowerCase() === lcItemId) {
                _this.removeItem(item);
            }
        });
        // Remove this item
        this._items.delete(lcItemId);
        // Delete ops trump all others, so lets filter out any existing ops on this item
        this._ops = this._ops.filter(function (op) { return op.item !== item; });
        // Add the op if it wasn't a new item
        if (!item.Meta.isNew) {
            this._ops.push(new DeleteItemOp_1.DeleteItemOp(item));
        }
        // Mark the item as dirty in case someone has a reference somewhere
        item.Meta.isDirty = true;
        return item;
    };
    MemoryDb.prototype.notifyChange = function (item, prop, oldValue, newValue) {
        if (!item.Meta.isVirtual && !item.Meta.isNew) {
            if (!item.Meta.isDirty) {
                this._ops.push(new UpdateItemOp_1.UpdateItemOp(item, prop, oldValue, newValue));
                item.Meta.isDirty = true;
            }
            else {
                var op = this._ops.find(function (op) { return op.item === item && op instanceof UpdateItemOp_1.UpdateItemOp; });
                if (op) {
                    op.recordChange(prop, oldValue, newValue);
                }
            }
        }
        if (prop === 'ID') {
            this._items.delete(oldValue.toLowerCase());
            this._items.set(newValue.toLowerCase(), item);
            this._items.forEach(function (child) {
                if (child.Parent && child.Parent.toLowerCase() === oldValue) {
                    child.Parent = newValue;
                }
            });
        }
        else if (prop === 'Path') {
            this._items.forEach(function (child) {
                if (child.Parent === item.ID) {
                    child.Path = child.Path.rebase(oldValue.Path, newValue.Path);
                }
            });
        }
    };
    Object.defineProperty(MemoryDb.prototype, "isDirty", {
        get: function () {
            return this.operationCount() > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MemoryDb.prototype, "operations", {
        get: function () {
            return this._ops.slice();
        },
        enumerable: true,
        configurable: true
    });
    MemoryDb.prototype.operationCount = function () {
        return this._ops.length;
    };
    return MemoryDb;
}());
exports.MemoryDb = MemoryDb;
//# sourceMappingURL=MemoryDb.js.map