"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_1 = require("./field");
class ItemInspector {
    constructor(store, item) {
        this._store = store;
        this._item = item;
    }
    get Item() { return this._item; }
    getTemplateItem() {
        const db = this._store.getDatabase(this._item.DB);
        if (!db) {
            throw new Error(`Item database not found: ${this._item.DB}`);
        }
        return db.getItem(this._item.Template);
    }
    getStandardValues() {
        let standardVals = this._store.glob(`${this._item.Path.Path}/__Standard Values`, this._item.DB);
        standardVals = standardVals.filter(item => item.Parent === this._item.ID);
        return standardVals[0];
    }
    inspectTemplate() {
        const tmpl = this.getTemplateItem();
        if (!tmpl) {
            throw new Error(`Template item not found: ${this._item.Template}`);
        }
        return new ItemInspector(this._store, tmpl);
    }
    children() {
        const children = this._store.glob(`${this._item.Path.Path}/*`, this._item.DB);
        return children.filter(i => i.Parent === this._item.ID);
    }
    fieldDefinitions() {
        const result = {
            errors: [],
            fields: [],
        };
        const db = this._store.getDatabase(this._item.DB);
        const generateFieldDefinitions = (inspector) => {
            const sections = inspector.children();
            sections.forEach(sectionItem => {
                const itemInspect = new ItemInspector(this._store, sectionItem);
                const fields = itemInspect.children();
                fields.forEach(fieldItem => {
                    const typeField = fieldItem.field('Type');
                    const sharedField = fieldItem.field('Shared');
                    const unversionField = fieldItem.field('Unversioned');
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
        const baseField = this._item.field('__Base template');
        if (baseField && baseField.Value) {
            const templateIds = field_1.treelistValue(baseField);
            const baseInspectors = templateIds.map(id => {
                const item = db.getItem(id);
                if (!item) {
                    // Only push errors for items that aren't the standard template id
                    if (!id || (id && ItemInspector.SystemTemplateGUIDs.indexOf(id.toLowerCase()) === -1)) {
                        result.errors.push(new Error(`Unable to find base template: ${id}`));
                    }
                    return;
                }
                return new ItemInspector(this._store, item);
            });
            baseInspectors.forEach(inspect => inspect && generateFieldDefinitions(inspect));
        }
        // Get the field definitions for the template item
        generateFieldDefinitions(this);
        return result;
    }
}
ItemInspector.SystemTemplateGUIDs = [
    '1930bbeb-7805-471a-a3be-4858ac7cf696',
    'a87a00b1-e6db-45ab-8b54-636fec3b5523',
    'b36ba9fd-0dc0-49c8-bea2-e55d70e6af28',
];
exports.ItemInspector = ItemInspector;
//# sourceMappingURL=ItemInspector.js.map