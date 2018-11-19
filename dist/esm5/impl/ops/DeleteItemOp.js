"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeleteItemOp = /** @class */ (function () {
    function DeleteItemOp(item) {
        this.name = "Delete Item";
        this.item = item;
    }
    DeleteItemOp.prototype.commit = function (bucket, cb) {
        throw new Error('Method not implemented.');
    };
    return DeleteItemOp;
}());
exports.DeleteItemOp = DeleteItemOp;
//# sourceMappingURL=DeleteItemOp.js.map