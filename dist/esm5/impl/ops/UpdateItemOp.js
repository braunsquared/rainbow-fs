"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UpdateItemOp = /** @class */ (function () {
    function UpdateItemOp(item, prop, oldValue, newValue) {
        this.name = "Update Item";
        this.item = item;
        this.changed = new Map([[prop, [oldValue, newValue]]]);
    }
    UpdateItemOp.prototype.recordChange = function (prop, oldValue, newValue) {
        var tuple = this.changed.get(prop);
        if (tuple) {
            tuple = [tuple[0], newValue];
        }
        else {
            tuple = [oldValue, newValue];
        }
        this.changed.set(prop, tuple);
    };
    UpdateItemOp.prototype.commit = function (bucket, cb) {
        throw new Error('Method not implemented.');
    };
    return UpdateItemOp;
}());
exports.UpdateItemOp = UpdateItemOp;
//# sourceMappingURL=UpdateItemOp.js.map