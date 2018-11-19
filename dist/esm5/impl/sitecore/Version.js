"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Field_1 = require("./Field");
var Version = /** @class */ (function () {
    function Version(version) {
        this.Version = 1;
        this.Fields = [];
        this.Version = version;
    }
    Version.prototype.addField = function (field) {
        this.Fields.push(field);
        return this;
    };
    Version.prototype.removeField = function (field) {
        var idx = this.Fields.indexOf(field);
        if (idx >= 0) {
            this.Fields.splice(idx, 1);
        }
        return this;
    };
    Version.prototype.field = function (idOrName) {
        return this.Fields.find(function (f) { return f.ID === idOrName || f.Hint === idOrName; });
    };
    Version.prototype.toObject = function () {
        var obj = {
            Version: this.Version
        };
        if (this.Fields.length) {
            obj.Fields = this.Fields.map(function (f) { return f.toObject(); });
        }
        return obj;
    };
    Version.fromObject = function (obj) {
        var version = new Version(obj.Version);
        if (obj.Fields) {
            version.Fields = obj.Fields.map(function (fieldObj) { return Field_1.Field.fromObject(fieldObj); });
        }
        return version;
    };
    return Version;
}());
exports.Version = Version;
//# sourceMappingURL=Version.js.map