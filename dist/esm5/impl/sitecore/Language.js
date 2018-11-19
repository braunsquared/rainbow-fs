"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Version_1 = require("./Version");
var Field_1 = require("./Field");
var Language = /** @class */ (function () {
    function Language(lang) {
        this.Language = "en";
        this.Fields = [];
        this.Versions = [];
        this.Language = lang;
    }
    Language.prototype.addVersion = function (v) {
        this.Versions.push(v);
        return this;
    };
    Language.prototype.removeVersion = function (v) {
        var idx = this.Versions.indexOf(v);
        if (idx >= 0) {
            this.Versions.splice(idx, 1);
        }
        return this;
    };
    Language.prototype.latestVersion = function () {
        var latest = this.Versions[0];
        this.Versions.forEach(function (v) {
            if (!latest || (latest && latest.Version < v.Version)) {
                latest = v;
            }
        });
        return latest;
    };
    Language.prototype.addField = function (field) {
        this.Fields.push(field);
        return this;
    };
    Language.prototype.removeField = function (field) {
        var idx = this.Fields.indexOf(field);
        if (idx >= 0) {
            this.Fields.splice(idx, 1);
        }
        return this;
    };
    Language.prototype.field = function (idOrName) {
        var field = this.Fields.find(function (f) { return f.ID === idOrName || f.Hint === idOrName; });
        if (field) {
            return field;
        }
        var version = this.latestVersion();
        if (version) {
            return version.field(idOrName);
        }
    };
    Language.prototype.toObject = function () {
        var obj = {
            Language: this.Language,
        };
        if (this.Fields.length) {
            obj.Fields = this.Fields.map(function (f) { return f.toObject(); });
        }
        if (this.Versions.length) {
            obj.Versions = this.Versions.map(function (v) { return v.toObject(); });
        }
        return obj;
    };
    Language.fromObject = function (obj) {
        var lang = new Language(obj.Language);
        if (obj.Fields) {
            lang.Fields = obj.Fields.map(function (fObj) { return Field_1.Field.fromObject(fObj); });
        }
        if (obj.Versions) {
            lang.Versions = obj.Versions.map(function (vObj) { return Version_1.Version.fromObject(vObj); });
        }
        return lang;
    };
    return Language;
}());
exports.Language = Language;
//# sourceMappingURL=Language.js.map