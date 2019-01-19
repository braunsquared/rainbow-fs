"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guid_1 = require("./guid");
function treelistValue(field, defaultValue = []) {
    if (!field || !field.Value) {
        return defaultValue;
    }
    return field.Value.split(/\n|\r\n/).map(id => guid_1.toGUID(id)).filter(i => i);
}
exports.treelistValue = treelistValue;
function booleanValue(field, defaultValue = false) {
    if (!field || !field.Value) {
        return defaultValue;
    }
    return field.Value === '1';
}
exports.booleanValue = booleanValue;
//# sourceMappingURL=field.js.map