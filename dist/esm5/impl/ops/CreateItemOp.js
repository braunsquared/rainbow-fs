"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateItemOp = /** @class */ (function () {
    function CreateItemOp(item) {
        this.name = "Create Item";
        this.item = item;
    }
    CreateItemOp.prototype.commit = function (bucket, cb) {
        throw new Error('Method not implemented.');
    };
    return CreateItemOp;
}());
exports.CreateItemOp = CreateItemOp;
//# sourceMappingURL=CreateItemOp.js.map