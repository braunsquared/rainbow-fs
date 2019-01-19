"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AbstractItemOp_1 = require("./AbstractItemOp");
const debug_1 = tslib_1.__importDefault(require("debug"));
const _log = debug_1.default('rainbow-fs:op:create');
class DeleteItemOp extends AbstractItemOp_1.AbstractItemOp {
    constructor(item) {
        super(item);
        this.name = 'Delete Item';
    }
    performCommit(store, bucket) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            _log(`unlinking item at ${this.item.Path.Path}`);
            yield bucket.unlink(this.item);
        });
    }
}
exports.DeleteItemOp = DeleteItemOp;
//# sourceMappingURL=DeleteItemOp.js.map