"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os_1 = tslib_1.__importDefault(require("os"));
class YamlWriter {
    constructor(stream) {
        this.indentSpaces = 2;
        this.indentChar = ' ';
        this.indent = 0;
        this._stream = stream;
        this._stream.write(`---${os_1.default.EOL}`);
    }
    increaseIndent() {
        this.indent += this.indentSpaces;
    }
    decreaseIndent() {
        if (this.indent < this.indentSpaces)
            throw new Error('Indent already at minimum');
        this.indent -= this.indentSpaces;
    }
    writeBeginListItem(key, value) {
        if (this.indent < this.indentSpaces)
            throw new Error('Indent is at minimum.  You must indent to support a list');
        this._stream.write(`${this.indentChar.repeat(this.indent - 2)}- `);
        this.writeMapInternal(key, value);
    }
    writeMap(key, value) {
        if (typeof value !== 'undefined') {
            this._stream.write(this.indentChar.repeat(this.indent));
            this.writeMapInternal(key, value);
        }
        else {
            this._stream.write(`${this.indentChar.repeat(this.indent)}${key}:${os_1.default.EOL}`);
        }
    }
    writeComment(value) {
        this._stream.write(`${this.indentChar.repeat(this.indent)}# ${value}${os_1.default.EOL}`);
    }
    indentMultilineString(indent, value) {
        const indentValue = this.indentChar.repeat(indent);
        let buffer = indentValue;
        for (let i = 0; i < value.length; i += 1) {
            const c = value.charAt(i);
            switch (c) {
                case '\r': {
                    if (i < value.length - 1 && value.charAt(i + 1) !== '\n') {
                        buffer += `${os_1.default.EOL}${indentValue}`;
                    }
                    break;
                }
                case '\n': {
                    buffer += `${os_1.default.EOL}${indentValue}`;
                    break;
                }
                default: {
                    buffer += c;
                    break;
                }
            }
        }
        return buffer;
    }
    encode(value) {
        return `"${value.replace(/"/g, '\\"')}"`;
    }
    writeMapInternal(key, value) {
        if (/[\n\r"\\]/.test(value)) {
            this._stream.write(`${key}: |\n${this.indentMultilineString(this.indent + this.indentSpaces, value)}${os_1.default.EOL}`);
            return;
        }
        let encoded = value;
        if (/[":\[\]{}!?-]/.test(value)) {
            encoded = this.encode(value);
        }
        this._stream.write(`${key}: ${encoded}${os_1.default.EOL}`);
    }
}
exports.YamlWriter = YamlWriter;
//# sourceMappingURL=YamlWriter.js.map