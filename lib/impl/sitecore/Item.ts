import { GUID, IItem, IPath, ILanguage, IField, ItemMetaData } from '../../model/Sitecore';
import { Field } from './Field';
import { Language } from './Language';
import { Path } from './Path';
import { IStore } from '../../Store';

export function defaultItemFactory(store: IStore, obj: any, meta?: ItemMetaData): IItem {
  const itemObj = {...obj};
  if (!itemObj.ID) {
    itemObj.ID = store.generateId(store.config.idSource(itemObj));
  }

  const item = Item.fromObject(itemObj);

  if(meta) {
    item.Meta = {...meta};
  }

  return item;
}

export class Item implements IItem {
  ID: GUID;
  Parent: GUID;
  Template: GUID;
  Path: IPath;
  DB: string = "master";

  SharedFields: Array<IField> = [];
  Languages: Array<ILanguage> = [];

  Meta: ItemMetaData = {
    isNew: true,
    isDirty: false,
    isVirtual: false,
  }

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
    };

    if (this.SharedFields.length) {
      obj.SharedFields = this.SharedFields.map(f => f.toObject());
    }

    if (this.Languages.length) {
      obj.Languages = this.Languages.map(l => l.toObject());
    }

    return obj;
  }

  static fromObject(obj: any): Item {
    const item = new Item(obj.ID, obj.Path);
    item.Parent = obj.Parent;
    item.Template = obj.Template;
    item.DB = obj.DB;

    if (obj.SharedFields) {
      item.SharedFields = obj.SharedFields.map((fieldObj: any) => Field.fromObject(fieldObj));
    }

    if (obj.Languages) {
      item.Languages = obj.Languages.map((langObj: any) => Language.fromObject(langObj));
    }

    return item;
  }
}