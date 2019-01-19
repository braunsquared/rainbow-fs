"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ItemProxyHandler_1 = require("./ItemProxyHandler");
const CreateItemOp_1 = require("../ops/CreateItemOp");
const DeleteItemOp_1 = require("../ops/DeleteItemOp");
const UpdateItemOp_1 = require("../ops/UpdateItemOp");
const debug_1 = tslib_1.__importDefault(require("debug"));
const _log = debug_1.default('rainbow-fs:db');
function memoryDbFactory(name) {
    return new MemoryDb(name);
}
exports.memoryDbFactory = memoryDbFactory;
class MemoryDb {
    constructor(name) {
        this._items = new Map();
        this.name = name;
        this._proxyHandler = new ItemProxyHandler_1.ItemProxyHandler(this);
        this._ops = [];
    }
    get items() {
        // Don't let outside parties change our item store directly
        return new Map(this._items);
    }
    getItem(id) {
        if (id) {
            return this._items.get(id.toLowerCase());
        }
    }
    addItem(item) {
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
                this._ops.push(new CreateItemOp_1.CreateItemOp(item));
            }
        }
        this._items.set(item.ID.toLowerCase(), item);
        return item;
    }
    removeItem(item) {
        if (!item.ID) {
            throw new Error('Items must have an ID to be removed from the DB');
        }
        const lcItemId = item.ID.toLowerCase();
        // Remove all our child items first
        const items = new Map(this._items);
        items.forEach(other => {
            if (other.Parent && other.Parent.toLowerCase() === lcItemId) {
                this.removeItem(item);
            }
        });
        // Remove this item
        this._items.delete(lcItemId);
        // Delete ops trump all others, so lets filter out any existing ops on this item
        this._ops = this._ops.filter(op => op.item !== item);
        // Add the op if it wasn't a new item
        if (!item.Meta.isNew) {
            this._ops.push(new DeleteItemOp_1.DeleteItemOp(item));
        }
        // Mark the item as dirty in case someone has a reference somewhere
        item.Meta.isDirty = true;
        return item;
    }
    notifyChange(item, prop, oldValue, newValue) {
        if (!item.Meta.isVirtual && !item.Meta.isNew) {
            if (!item.Meta.isDirty) {
                this._ops.push(new UpdateItemOp_1.UpdateItemOp(item, prop, oldValue, newValue));
                item.Meta.isDirty = true;
            }
            else {
                const op = this._ops.find(op => op.item === item && op instanceof UpdateItemOp_1.UpdateItemOp);
                if (op) {
                    op.recordChange(prop, oldValue, newValue);
                }
            }
        }
        if (prop === 'ID') {
            this._items.delete(oldValue.toLowerCase());
            this._items.set(newValue.toLowerCase(), item);
            this._items.forEach(child => {
                if (child.Parent && child.Parent.toLowerCase() === oldValue) {
                    child.Parent = newValue;
                }
            });
        }
        else if (prop === 'Path') {
            this._items.forEach(child => {
                if (child.Parent === item.ID) {
                    child.Path = child.Path.rebase(oldValue.Path, newValue.Path);
                }
            });
        }
    }
    get isDirty() {
        return this.operationCount() > 0;
    }
    get operations() {
        return [...this._ops];
    }
    operationCount() {
        return this._ops.length;
    }
    commit(store) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            _log(`committing ${this._ops.length} operations`);
            let n = 0;
            for (let i = 0; i < this._ops.length; i = i + 1) {
                yield this._ops[i].commit(store);
                if (this._ops[i].committed) {
                    n += 1;
                }
            }
            this._ops = this._ops.filter(op => !op.committed);
            _log(`committed ${n} operations. ${this._ops.length} operations left uncommitted.`);
        });
    }
}
exports.MemoryDb = MemoryDb;
//# sourceMappingURL=MemoryDb.js.map