"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = require("./Item");
class VirtualItem extends Item_1.Item {
    constructor() {
        super(...arguments);
        this.Meta = {
            isNew: false,
            isDirty: false,
            isVirtual: true,
        };
    }
    addSharedField(field) {
        throw new Error('Unable to perform action on virtual item.');
    }
    removeSharedField(field) {
        throw new Error('Unable to perform action on virtual item.');
    }
    addLanguage(lang) {
        throw new Error('Unable to perform action on virtual item.');
    }
    removeLanguage(lang) {
        throw new Error('Unable to perform action on virtual item.');
    }
}
exports.VirtualItem = VirtualItem;
//# sourceMappingURL=VirtualItem.js.map