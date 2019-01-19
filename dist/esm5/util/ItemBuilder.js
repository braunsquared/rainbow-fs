"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ItemInspector_1 = require("./ItemInspector");
const guid_1 = require("./guid");
const Path_1 = require("../impl/sitecore/Path");
const aguid_1 = tslib_1.__importDefault(require("aguid"));
const luxon = tslib_1.__importStar(require("luxon"));
class ItemBuilder {
    constructor(store, templateItem) {
        this._serializeField = (def) => {
            return {
                ID: def.ID,
                Hint: def.Name,
                Value: this._fields.get(def),
            };
        };
        this._serializeBlob = (def) => {
            const value = this._blobs.get(def);
            if (!value)
                return;
            return {
                ID: def.ID,
                Hint: def.Name,
                BlobID: value.BlobID,
                Value: value.Value,
            };
        };
        this._serializeFields = (predicate) => {
            const fieldDefs = Array.from(this._fields.keys()).filter(predicate).map(this._serializeField);
            const blobDefs = Array.from(this._blobs.keys()).filter(predicate).map(this._serializeBlob);
            return [...fieldDefs, ...blobDefs];
        };
        this._store = store;
        this._fields = new Map();
        this._blobs = new Map();
        if (typeof templateItem === 'string') {
            this._templateId = templateItem;
            this._knownDefs = [];
        }
        else {
            this._templateId = templateItem.ID;
            const inspector = new ItemInspector_1.ItemInspector(store, templateItem);
            this._knownDefs = inspector.fieldDefinitions().fields;
        }
    }
    setFieldByName(name, value) {
        const def = this._knownDefs.find(def => def.Name === name);
        if (!def) {
            throw new Error(`Unknown field: ${name}`);
        }
        return this.setField(def, value);
    }
    setFieldByGUID(fieldId, value) {
        const def = this._knownDefs.find(def => guid_1.compareGUIDs(def.ID, fieldId));
        if (!def) {
            throw new Error(`Unknown field: ${fieldId}`);
        }
        return this.setField(def, value);
    }
    // tslint:disable-next-line:max-line-length
    setFieldWithDetails(fieldId, name, type, shared, unversioned, value) {
        return this.setField({
            ID: fieldId,
            Name: name,
            Type: type,
            Shared: shared,
            Unversioned: unversioned,
        }, value);
    }
    setField(def, value) {
        for (const key of this._fields.keys()) {
            if (guid_1.compareGUIDs(key.ID, def.ID) && key !== def) {
                throw new Error(`Duplicate field key: ${key.ID}`);
            }
        }
        this._fields.set(def, value);
        return this;
    }
    setBlobByName(name, base64) {
        const def = this._knownDefs.find(def => def.Name === name);
        if (!def) {
            throw new Error(`Unknown field: ${name}`);
        }
        return this.setBlob(def, base64);
    }
    setBlobByGUID(fieldId, base64) {
        const def = this._knownDefs.find(def => guid_1.compareGUIDs(def.ID, fieldId));
        if (!def) {
            throw new Error(`Unknown field: ${fieldId}`);
        }
        return this.setBlob(def, base64);
    }
    // tslint:disable-next-line:max-line-length
    setBlobWithDetails(fieldId, name, type, shared, unversioned, base64) {
        return this.setBlob({
            ID: fieldId,
            Name: name,
            Type: type,
            Shared: shared,
            Unversioned: unversioned,
        }, base64);
    }
    setBlob(def, base64) {
        const blobId = aguid_1.default(base64);
        this._blobs.set(def, { Value: base64, BlobID: blobId });
        return this;
    }
    buildItem(dbName, scPath, language) {
        // We build the item js and then let the store item factory do the magic
        const path = new Path_1.Path(scPath);
        const itemJs = {
            Name: path.Name,
            Template: this._templateId,
            Path: path.Path,
            DB: dbName,
        };
        const sharedFields = this._serializeFields(def => def.Shared);
        if (sharedFields.length) {
            itemJs.SharedFields = sharedFields;
        }
        if (language) {
            const langJs = { Language: language };
            const unversionedFields = this._serializeFields(def => def.Unversioned);
            if (unversionedFields.length) {
                langJs.Fields = unversionedFields;
            }
            const versionJs = { Version: 1 };
            const versionedFields = this._serializeFields(def => !def.Shared && !def.Unversioned);
            if (versionedFields.length) {
                versionJs.Fields = versionedFields;
            }
            langJs.Versions = [versionJs];
            itemJs.Languages = [langJs];
        }
        return this._store.createItemFromObject(itemJs, {
            isNew: true,
            isDirty: true,
            isVirtual: false,
        });
    }
    static formatDate(date) {
        return luxon.DateTime.fromJSDate(date).toFormat('yyyyMMdd\'T\'HHmmss\'Z\'');
    }
}
exports.ItemBuilder = ItemBuilder;
//# sourceMappingURL=ItemBuilder.js.map