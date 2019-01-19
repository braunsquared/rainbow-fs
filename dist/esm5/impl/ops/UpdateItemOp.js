"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AbstractItemOp_1 = require("./AbstractItemOp");
const debug_1 = tslib_1.__importDefault(require("debug"));
const _log = debug_1.default('rainbow-fs:op:create');
class UpdateItemOp extends AbstractItemOp_1.AbstractItemOp {
    constructor(item, prop, oldValue, newValue) {
        super(item);
        this.name = 'Update Item';
        this.changed = new Map([[prop, [oldValue, newValue]]]);
    }
    recordChange(prop, oldValue, newValue) {
        let tuple = this.changed.get(prop);
        if (tuple) {
            tuple = [tuple[0], newValue];
        }
        else {
            tuple = [oldValue, newValue];
        }
        this.changed.set(prop, tuple);
    }
    performCommit(store, bucket) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            _log(`updating item at ${this.item.Path.Path}`);
            yield bucket.write(this.item);
        });
    }
}
exports.UpdateItemOp = UpdateItemOp;
//# sourceMappingURL=UpdateItemOp.js.map