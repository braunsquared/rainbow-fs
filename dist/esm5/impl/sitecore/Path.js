"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("../../util/path"));
class Path {
    constructor(scPath) {
        const parsed = path.parse(scPath);
        this.Name = parsed.name;
        this.Folder = parsed.base;
        this.Path = parsed.path;
        this.Tokens = parsed.tokens;
    }
    rebase(oldRoot, newRoot) {
        // TODO: handle the fact that sitecore is not case sensitive
        if (!this.Path.startsWith(oldRoot)) {
            throw new Error('Unable to rebase when old root does not match');
        }
        return new Path(`${newRoot}/${this.Path.substring(oldRoot.length)}`);
    }
    relativePath(childPath) {
        if (!childPath.Path.startsWith(this.Path)) {
            throw new Error('Path is not a base of the child path');
        }
        return new Path(childPath.Path.substring(this.Path.length));
    }
}
exports.Path = Path;
//# sourceMappingURL=Path.js.map