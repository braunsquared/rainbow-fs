"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Field = /** @class */ (function () {
    function Field(id, hint, value) {
        this.ID = "";
        this.ID = id;
        this.Hint = hint;
        this.Value = value;
    }
    Field.prototype.toObject = function () {
        var obj = {
            ID: this.ID,
            Hint: this.Hint,
            Value: this.Value,
        };
        if (this.Type) {
            obj.Type = this.Type;
        }
        return obj;
    };
    Field.fromObject = function (obj) {
        var field = new Field(obj.ID, obj.Hint, obj.Value);
        field.Type = obj.Type;
        return field;
    };
    return Field;
}());
exports.Field = Field;
//# sourceMappingURL=Field.js.map