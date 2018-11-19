"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Field_1 = require("./Field");
var Language_1 = require("./Language");
var Path_1 = require("./Path");
function defaultItemFactory(store, obj, meta) {
    var itemObj = tslib_1.__assign({}, obj);
    if (!itemObj.ID) {
        itemObj.ID = store.generateId(store.config.idSource(itemObj));
    }
    var item = Item.fromObject(itemObj);
    if (meta) {
        item.Meta = tslib_1.__assign({}, meta);
    }
    return item;
}
exports.defaultItemFactory = defaultItemFactory;
var Item = /** @class */ (function () {
    function Item(id, path) {
        this.DB = "master";
        this.SharedFields = [];
        this.Languages = [];
        this.Meta = {
            isNew: true,
            isDirty: false,
            isVirtual: false,
        };
        this.ID = id;
        this.Path = new Path_1.Path(path);
    }
    Item.prototype.addSharedField = function (field) {
        this.SharedFields.push(field);
        return this;
    };
    Item.prototype.removeSharedField = function (field) {
        var idx = this.SharedFields.indexOf(field);
        if (idx >= 0) {
            this.SharedFields.splice(idx, 1);
        }
        return this;
    };
    Item.prototype.addLanguage = function (lang) {
        this.Languages.push(lang);
        return this;
    };
    Item.prototype.removeLanguage = function (lang) {
        var idx = this.Languages.indexOf(lang);
        if (idx >= 0) {
            this.Languages.splice(idx, 1);
        }
        return this;
    };
    Item.prototype.field = function (idOrName, lang) {
        if (lang === void 0) { lang = 'en'; }
        var field = this.SharedFields.find(function (f) { return f.ID === idOrName || f.Hint === idOrName; });
        if (field) {
            return field;
        }
        var langInst = this.Languages.find(function (l) { return l.Language === lang; });
        if (langInst) {
            return langInst.field(idOrName);
        }
    };
    Item.prototype.toObject = function () {
        var obj = {
            ID: this.ID,
            Parent: this.Parent,
            Template: this.Template,
            Path: this.Path.Path,
            DB: this.DB,
        };
        if (this.SharedFields.length) {
            obj.SharedFields = this.SharedFields.map(function (f) { return f.toObject(); });
        }
        if (this.Languages.length) {
            obj.Languages = this.Languages.map(function (l) { return l.toObject(); });
        }
        return obj;
    };
    Item.fromObject = function (obj) {
        var item = new Item(obj.ID, obj.Path);
        item.Parent = obj.Parent;
        item.Template = obj.Template;
        item.DB = obj.DB;
        if (obj.SharedFields) {
            item.SharedFields = obj.SharedFields.map(function (fieldObj) { return Field_1.Field.fromObject(fieldObj); });
        }
        if (obj.Languages) {
            item.Languages = obj.Languages.map(function (langObj) { return Language_1.Language.fromObject(langObj); });
        }
        return item;
    };
    return Item;
}());
exports.Item = Item;
//# sourceMappingURL=Item.js.map