"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toGUID(val) {
    var match = /^\{?([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\}?$/.exec(val);
    if (match) {
        return match[1].toLowerCase();
    }
}
exports.toGUID = toGUID;
function compareGUIDs(a, b) {
    if (!a || !b) {
        return false;
    }
    else {
        return a.toLowerCase() === b.toLowerCase();
    }
}
exports.compareGUIDs = compareGUIDs;
//# sourceMappingURL=guid.js.map