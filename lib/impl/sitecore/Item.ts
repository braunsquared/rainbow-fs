import { GUID, IItem, IPath, ILanguage, IField, ItemMetaData } from '../../model/Sitecore';
import { Field } from './Field';
import { Language } from './Language';
import { Path } from './Path';
import { IStore } from '../../Store';
import { IYamlWriter } from '../../io/IYamlWriter';

export function defaultItemFactory(store: IStore, obj: any, meta?: ItemMetaData): IItem {
  const itemObj = { ...obj };
  if (!itemObj.ID) {
    itemObj.ID = store.generateId(store.config.idSource(itemObj));
  }

  if (!itemObj.Parent && itemObj.Path && itemObj.DB) {
    const parsedPath = new Path(itemObj.Path);
    const parentItems = store.glob(parsedPath.Folder, itemObj.DB);
    if (parentItems.length === 1) {
      itemObj.Parent = parentItems[0].ID;
    }
  }

  const item = Item.fromObject(itemObj);

  if (meta) {
    item.Meta = { ...meta };
  }

  return item;
}

export class Item implements IItem {
  ID: GUID;
  Parent: GUID;
  Template: GUID;
  Path: IPath;
  DB: string = 'master';
  BranchID: GUID;

  SharedFields: IField[] = [];
  Languages: ILanguage[] = [];

  Meta: ItemMetaData = {
    isNew: true,
    isDirty: false,
    isVirtual: false,
  };

  constructor(id: GUID, path: string) {
    this.ID = id;
    this.Path = new Path(path);
  }

  addSharedField(field: IField): this {
    this.SharedFields.push(field);
    return this;
  }

  removeSharedField(field: IField): this {
    const idx = this.SharedFields.indexOf(field);
    if (idx >= 0) {
      this.SharedFields.splice(idx, 1);
    }
    return this;
  }

  addLanguage(lang: ILanguage): this {
    this.Languages.push(lang);
    return this;
  }

  removeLanguage(lang: ILanguage): this {
    const idx = this.Languages.indexOf(lang);
    if (idx >= 0) {
      this.Languages.splice(idx, 1);
    }
    return this;
  }

  field(idOrName: string, lang: string = 'en'): IField | undefined {
    const field = this.SharedFields.find(f => f.ID === idOrName || f.Hint === idOrName);

    if (field) {
      return field;
    }

    const langInst = this.Languages.find(l => l.Language === lang);
    if (langInst) {
      return langInst.field(idOrName);
    }
  }

  toObject(): any {
    const obj: any = {
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

  write(writer: IYamlWriter) {
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

  static fromObject(obj: any): Item {
    const item = new Item(obj.ID, obj.Path);
    item.Parent = obj.Parent;
    item.Template = obj.Template;
    item.DB = obj.DB;
    item.BranchID = obj.BranchID;

    if (obj.SharedFields) {
      item.SharedFields = obj.SharedFields.map((fieldObj: any) => Field.fromObject(fieldObj));
    }

    if (obj.Languages) {
      item.Languages = obj.Languages.map((langObj: any) => Language.fromObject(langObj));
    }

    return item;
  }
}
