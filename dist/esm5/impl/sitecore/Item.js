"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Field_1 = require("./Field");
const Language_1 = require("./Language");
const Path_1 = require("./Path");
function defaultItemFactory(store, obj, meta) {
    const itemObj = Object.assign({}, obj);
    if (!itemObj.ID) {
        itemObj.ID = store.generateId(store.config.idSource(itemObj));
    }
    if (!itemObj.Parent && itemObj.Path && itemObj.DB) {
        const parsedPath = new Path_1.Path(itemObj.Path);
        const parentItems = store.glob(parsedPath.Folder, itemObj.DB);
        if (parentItems.length === 1) {
            itemObj.Parent = parentItems[0].ID;
        }
    }
    const item = Item.fromObject(itemObj);
    if (meta) {
        item.Meta = Object.assign({}, meta);
    }
    return item;
}
exports.defaultItemFactory = defaultItemFactory;
class Item {
    constructor(id, path) {
        this.DB = 'master';
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
    addSharedField(field) {
        this.SharedFields.push(field);
        return this;
    }
    removeSharedField(field) {
        const idx = this.SharedFields.indexOf(field);
        if (idx >= 0) {
            this.SharedFields.splice(idx, 1);
        }
        return this;
    }
    addLanguage(lang) {
        this.Languages.push(lang);
        return this;
    }
    removeLanguage(lang) {
        const idx = this.Languages.indexOf(lang);
        if (idx >= 0) {
            this.Languages.splice(idx, 1);
        }
        return this;
    }
    field(idOrName, lang = 'en') {
        const field = this.SharedFields.find(f => f.ID === idOrName || f.Hint === idOrName);
        if (field) {
            return field;
        }
        const langInst = this.Languages.find(l => l.Language === lang);
        if (langInst) {
            return langInst.field(idOrName);
        }
    }
    toObject() {
        const obj = {
            ID: this.ID,
            Parent: this.Parent,
            Template: this.Template,
            Path: this.Path.Path,
            DB: this.DB,
            BranchID: this.BranchID,
        };
        if (this.SharedFields.length) {
            obj.SharedFields = this.SharedFields.map(f => f.toObject());
        }
        if (this.Languages.length) {
            obj.Languages = this.Languages.map(l => l.toObject());
        }
        return obj;
    }
    write(writer) {
        writer.writeMap('ID', this.ID);
        writer.writeMap('Parent', this.Parent);
        writer.writeMap('Template', this.Template);
        writer.writeMap('Path', this.Path.Path);
        writer.writeMap('DB', this.DB);
        if (this.BranchID) {
            writer.writeMap('BranchID', this.BranchID);
        }
        if (this.SharedFields.length) {
            writer.writeMap('SharedFields');
            writer.increaseIndent();
            this.SharedFields.forEach(f => f.write(writer));
            writer.decreaseIndent();
        }
        if (this.Languages.length) {
            writer.writeMap('Languages');
            writer.increaseIndent();
            this.Languages.forEach(l => l.write(writer));
            writer.decreaseIndent();
        }
    }
    static fromObject(obj) {
        const item = new Item(obj.ID, obj.Path);
        item.Parent = obj.Parent;
        item.Template = obj.Template;
        item.DB = obj.DB;
        item.BranchID = obj.BranchID;
        if (obj.SharedFields) {
            item.SharedFields = obj.SharedFields.map((fieldObj) => Field_1.Field.fromObject(fieldObj));
        }
        if (obj.Languages) {
            item.Languages = obj.Languages.map((langObj) => Language_1.Language.fromObject(langObj));
        }
        return item;
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map