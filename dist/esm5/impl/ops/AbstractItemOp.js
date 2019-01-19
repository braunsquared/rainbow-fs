"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class AbstractItemOp {
    constructor(item) {
        this.name = 'Abstract Item Operation';
        this.committed = false;
        this.item = item;
    }
    commit(store) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.committed) {
                throw new Error('Operation already committed');
            }
            const bucket = store.closestBucket(this.item.DB, this.item.Path.Path);
            if (!bucket) {
                throw new Error(`Unabled to commit operation.  No matching bucket found: ${this.item.Path.Path}`);
            }
            yield this.performCommit(store, bucket);
            this.committed = true;
        });
    }
}
exports.AbstractItemOp = AbstractItemOp;
//# sourceMappingURL=AbstractItemOp.js.map