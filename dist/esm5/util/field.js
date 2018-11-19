"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var guid_1 = require("./guid");
function treelistValue(field, defaultValue) {
    if (defaultValue === void 0) { defaultValue = []; }
    if (!field || !field.Value) {
        return defaultValue;
    }
    return field.Value.split(/\n|\r\n/).map(function (id) { return guid_1.toGUID(id); }).filter(function (i) { return i; });
}
exports.treelistValue = treelistValue;
function booleanValue(field, defaultValue) {
    if (defaultValue === void 0) { defaultValue = false; }
    if (!field || !field.Value) {
        return defaultValue;
    }
    return field.Value === '1';
}
exports.booleanValue = booleanValue;
//# sourceMappingURL=field.js.map