"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Version_1 = require("./Version");
const Field_1 = require("./Field");
class Language {
    constructor(lang) {
        this.Language = "en";
        this.Fields = [];
        this.Versions = [];
        this.Language = lang;
    }
    addVersion(v) {
        this.Versions.push(v);
        return this;
    }
    removeVersion(v) {
        const idx = this.Versions.indexOf(v);
        if (idx >= 0) {
            this.Versions.splice(idx, 1);
        }
        return this;
    }
    latestVersion() {
        let latest = this.Versions[0];
        this.Versions.forEach(v => {
            if (!latest || (latest && latest.Version < v.Version)) {
                latest = v;
            }
        });
        return latest;
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
        const field = this.Fields.find(f => f.ID === idOrName || f.Hint === idOrName);
        if (field) {
            return field;
        }
        const version = this.latestVersion();
        if (version) {
            return version.field(idOrName);
        }
    }
    toObject() {
        const obj = {
            Language: this.Language,
        };
        if (this.Fields.length) {
            obj.Fields = this.Fields.map(f => f.toObject());
        }
        if (this.Versions.length) {
            obj.Versions = this.Versions.map(v => v.toObject());
        }
        return obj;
    }
    write(writer) {
        if (this.Fields.length === 0 && this.Versions.length === 0) {
            return;
        }
        writer.writeBeginListItem('Language', this.Language);
        if (this.Fields.length) {
            writer.writeMap('Fields');
            writer.increaseIndent();
            this.Fields.forEach(f => f.write(writer));
            writer.decreaseIndent();
        }
        writer.writeMap('Versions');
        writer.increaseIndent();
        this.Versions.forEach(v => v.write(writer));
        writer.decreaseIndent();
    }
    static fromObject(obj) {
        const lang = new Language(obj.Language);
        if (obj.Fields) {
            lang.Fields = obj.Fields.map((fObj) => Field_1.Field.fromObject(fObj));
        }
        if (obj.Versions) {
            lang.Versions = obj.Versions.map((vObj) => Version_1.Version.fromObject(vObj));
        }
        return lang;
    }
}
exports.Language = Language;
//# sourceMappingURL=Language.js.map