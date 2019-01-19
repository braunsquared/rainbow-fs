"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Field_1 = require("./Field");
class Version {
    constructor(version) {
        this.Version = 1;
        this.Fields = [];
        this.Version = version;
    }
    addField(field) {
        this.Fields.push(field);
        return this;
    }
    removeField(field) {
        const idx = this.Fields.indexOf(field);
        if (idx >= 0) {
            this.Fields.splice(idx, 1);
        }
        return this;
    }
    field(idOrName) {
        return this.Fields.find(f => f.ID === idOrName || f.Hint === idOrName);
    }
    toObject() {
        const obj = {
            Version: this.Version,
        };
        if (this.Fields.length) {
            obj.Fields = this.Fields.map(f => f.toObject());
        }
        return obj;
    }
    write(writer) {
        writer.writeBeginListItem('Version', `${this.Version}`);
        if (this.Fields.length) {
            writer.writeMap('Fields');
            writer.increaseIndent();
            this.Fields.forEach(f => f.write(writer));
            writer.decreaseIndent();
        }
    }
    static fromObject(obj) {
        const version = new Version(obj.Version);
        if (obj.Fields) {
            version.Fields = obj.Fields.map((fieldObj) => Field_1.Field.fromObject(fieldObj));
        }
        return version;
    }
}
exports.Version = Version;
//# sourceMappingURL=Version.js.map