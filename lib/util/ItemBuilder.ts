import { IStore } from '../Store';
import { IItem, GUID } from '../model/Sitecore';
import { ItemInspector, FieldDefinition } from './ItemInspector';
import { compareGUIDs } from './guid';
import { Path } from '../impl/sitecore/Path';
import aguid from 'aguid';
import * as luxon from 'luxon';

export interface Blob {
  Value: string;
  BlobID: string;
}

export class ItemBuilder {
  private _store: IStore;
  private _templateId: GUID;

  private _fields: Map<FieldDefinition, any>;
  private _blobs: Map<FieldDefinition, Blob>;
  private _knownDefs: FieldDefinition[];

  constructor(store: IStore, templateItem: IItem | string) {
    this._store = store;
    this._fields = new Map();
    this._blobs = new Map();

    if (typeof templateItem === 'string') {
      this._templateId = templateItem;
      this._knownDefs = [];
    } else {
      this._templateId = templateItem.ID;
      const inspector = new ItemInspector(store, templateItem);
      this._knownDefs = inspector.fieldDefinitions().fields;
    }
  }

  setFieldByName(name: string, value: any): this {
    const def = this._knownDefs.find(def => def.Name === name);
    if (!def) {
      throw new Error(`Unknown field: ${name}`);
    }
    return this.setField(def, value);
  }

  setFieldByGUID(fieldId: GUID, value: any): this {
    const def = this._knownDefs.find(def => compareGUIDs(def.ID, fieldId));
    if (!def) {
      throw new Error(`Unknown field: ${fieldId}`);
    }
    return this.setField(def, value);
  }

  // tslint:disable-next-line:max-line-length
  setFieldWithDetails(fieldId: GUID, name: string, type: string, shared: boolean, unversioned: boolean, value: any): this {
    return this.setField(
      {
        ID: fieldId,
        Name: name,
        Type: type,
        Shared: shared,
        Unversioned: unversioned,
      },
      value,
    );
  }

  setField(def: FieldDefinition, value: any): this {
    for (const key of this._fields.keys()) {
      if (compareGUIDs(key.ID, def.ID) && key !== def) {
        throw new Error(`Duplicate field key: ${key.ID}`);
      }
    }

    this._fields.set(def, value);
    return this;
  }

  setBlobByName(name: string, base64: string): this {
    const def = this._knownDefs.find(def => def.Name === name);
    if (!def) {
      throw new Error(`Unknown field: ${name}`);
    }
    return this.setBlob(def, base64);
  }

  setBlobByGUID(fieldId: GUID, base64: string): this {
    const def = this._knownDefs.find(def => compareGUIDs(def.ID, fieldId));
    if (!def) {
      throw new Error(`Unknown field: ${fieldId}`);
    }
    return this.setBlob(def, base64);
  }

  // tslint:disable-next-line:max-line-length
  setBlobWithDetails(fieldId: GUID, name: string, type: string, shared: boolean, unversioned: boolean, base64: string): this {
    return this.setBlob(
      {
        ID: fieldId,
        Name: name,
        Type: type,
        Shared: shared,
        Unversioned: unversioned,
      },
      base64,
    );
  }

  setBlob(def: FieldDefinition, base64: string): this {
    const blobId = aguid(base64);
    this._blobs.set(def, { Value: base64, BlobID: blobId });

    return this;
  }

  private _serializeField = (def: FieldDefinition): any => {
    return {
      ID: def.ID,
      Hint: def.Name,
      Value: this._fields.get(def),
    };
  }

  private _serializeBlob = (def: FieldDefinition): any => {
    const value = this._blobs.get(def);

    if (!value) return;

    return {
      ID: def.ID,
      Hint: def.Name,
      BlobID: value.BlobID,
      Value: value.Value,
    };
  }

  private _serializeFields = (predicate: (def: FieldDefinition) => boolean): any[] => {
    const fieldDefs = Array.from(this._fields.keys()).filter(predicate).map(this._serializeField);
    const blobDefs = Array.from(this._blobs.keys()).filter(predicate).map(this._serializeBlob);
    return [...fieldDefs, ...blobDefs];
  }

  buildItem(dbName: string, scPath: string, language?: string): IItem {
    // We build the item js and then let the store item factory do the magic
    const path = new Path(scPath);

    const itemJs: any = {
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
      const langJs: any = { Language: language };
      const unversionedFields = this._serializeFields(def => def.Unversioned);
      if (unversionedFields.length) {
        langJs.Fields = unversionedFields;
      }

      const versionJs: any = { Version: 1 };
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

  static formatDate(date: Date): string {
    return luxon.DateTime.fromJSDate(date).toFormat('yyyyMMdd\'T\'HHmmss\'Z\'');
  }
}
