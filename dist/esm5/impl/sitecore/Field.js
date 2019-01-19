"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Field {
    constructor(id, hint, value) {
        this.ID = "";
        this.ID = id;
        this.Hint = hint;
        this.Value = value;
    }
    toObject() {
        const obj = {
            ID: this.ID,
            Hint: this.Hint,
            Value: this.Value,
        };
        if (this.Type) {
            obj.Type = this.Type;
        }
        if (this.BlobID) {
            obj.BlobID = this.BlobID;
        }
        return obj;
    }
    write(writer) {
        writer.writeBeginListItem('ID', this.ID);
        writer.writeMap('Hint', this.Hint);
        if (this.BlobID) {
            writer.writeMap('BlobID', this.BlobID);
        }
        if (this.Type) {
            writer.writeMap('Type', this.Type);
        }
        writer.writeMap('Value', this.Value);
    }
    static fromObject(obj) {
        const field = new Field(obj.ID, obj.Hint, obj.Value);
        field.Type = obj.Type;
        field.BlobID = obj.BlobID;
        return field;
    }
}
exports.Field = Field;
//# sourceMappingURL=Field.js.map