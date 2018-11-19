"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Item_1 = require("./Item");
var VirtualItem = /** @class */ (function (_super) {
    tslib_1.__extends(VirtualItem, _super);
    function VirtualItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Meta = {
            isNew: false,
            isDirty: false,
            isVirtual: true,
        };
        return _this;
    }
    VirtualItem.prototype.addSharedField = function (field) {
        throw new Error('Unable to perform action on virtual item.');
    };
    VirtualItem.prototype.removeSharedField = function (field) {
        throw new Error('Unable to perform action on virtual item.');
    };
    VirtualItem.prototype.addLanguage = function (lang) {
        throw new Error('Unable to perform action on virtual item.');
    };
    VirtualItem.prototype.removeLanguage = function (lang) {
        throw new Error('Unable to perform action on virtual item.');
    };
    return VirtualItem;
}(Item_1.Item));
exports.VirtualItem = VirtualItem;
//# sourceMappingURL=VirtualItem.js.map