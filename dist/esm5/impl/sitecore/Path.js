"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path = tslib_1.__importStar(require("../../util/path"));
var Path = /** @class */ (function () {
    function Path(scPath) {
        var parsed = path.parse(scPath);
        this.Name = parsed.name;
        this.Folder = parsed.base;
        this.Path = parsed.path;
        this.Tokens = parsed.tokens;
    }
    Path.prototype.rebase = function (oldRoot, newRoot) {
        // TODO: handle the fact that sitecore is not case sensitive
        if (!this.Path.startsWith(oldRoot)) {
            throw new Error('Unable to rebase when old root does not match');
        }
        return new Path(newRoot + "/" + this.Path.substring(oldRoot.length));
    };
    Path.prototype.relativePath = function (childPath) {
        if (!childPath.Path.startsWith(this.Path)) {
            throw new Error('Path is not a base of the child path');
        }
        return new Path(childPath.Path.substring(this.Path.length));
    };
    return Path;
}());
exports.Path = Path;
//# sourceMappingURL=Path.js.map