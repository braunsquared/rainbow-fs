"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var field_1 = require("./field");
var ItemInspector = /** @class */ (function () {
    function ItemInspector(store, item) {
        this._store = store;
        this._item = item;
    }
    Object.defineProperty(ItemInspector.prototype, "Item", {
        get: function () { return this._item; },
        enumerable: true,
        configurable: true
    });
    ItemInspector.prototype.getTemplateItem = function () {
        var db = this._store.getDatabase(this._item.DB);
        if (!db) {
            throw new Error("Item database not found: " + this._item.DB);
        }
        return db.getItem(this._item.Template);
    };
    ItemInspector.prototype.inspectTemplate = function () {
        var tmpl = this.getTemplateItem();
        if (!tmpl) {
            throw new Error("Template item not found: " + this._item.Template);
        }
        return new ItemInspector(this._store, tmpl);
    };
    ItemInspector.prototype.children = function () {
        var _this = this;
        var children = this._store.glob(this._item.Path.Path + "/*", this._item.DB);
        return children.filter(function (i) { return i.Parent === _this._item.ID; });
    };
    ItemInspector.prototype.fieldDefinitions = function () {
        var _this = this;
        var result = {
            errors: [],
            fields: [],
        };
        var db = this._store.getDatabase(this._item.DB);
        var generateFieldDefinitions = function (inspector) {
            var sections = inspector.children();
            sections.forEach(function (sectionItem) {
                var itemInspect = new ItemInspector(_this._store, sectionItem);
                var fields = itemInspect.children();
                fields.forEach(function (fieldItem) {
                    var typeField = fieldItem.field('Type');
                    var sharedField = fieldItem.field('Shared');
                    var unversionField = fieldItem.field('Unversioned');
                    result.fields.push({
                        ID: fieldItem.ID,
                        Name: fieldItem.Path.Name,
                        Type: typeField && typeField.Value ? typeField.Value : '',
                        Shared: field_1.booleanValue(sharedField),
                        Unversioned: field_1.booleanValue(unversionField),
                        Item: fieldItem,
                    });
                });
            });
        };
        // Get the Base Templates
        var baseField = this._item.field('__Base template');
        if (baseField && baseField.Value) {
            var templateIds = field_1.treelistValue(baseField);
            var baseInspectors = templateIds.map(function (id) {
                var item = db.getItem(id);
                if (!item) {
                    // Only push errors for items that aren't the standard template id
                    if (!id || (id && ItemInspector.SystemTemplateGUIDs.indexOf(id.toLowerCase()) === -1)) {
                        result.errors.push(new Error("Unable to find base template: " + id));
                    }
                    return;
                }
                return new ItemInspector(_this._store, item);
            });
            baseInspectors.forEach(function (inspect) { return inspect && generateFieldDefinitions(inspect); });
        }
        // Get the field definitions for the template item
        generateFieldDefinitions(this);
        return result;
    };
    ItemInspector.SystemTemplateGUIDs = [
        '1930bbeb-7805-471a-a3be-4858ac7cf696',
        'a87a00b1-e6db-45ab-8b54-636fec3b5523',
        'b36ba9fd-0dc0-49c8-bea2-e55d70e6af28',
    ];
    return ItemInspector;
}());
exports.ItemInspector = ItemInspector;
//# sourceMappingURL=ItemInspector.js.map