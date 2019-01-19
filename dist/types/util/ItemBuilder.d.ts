import { IStore } from '../Store';
import { IItem, GUID } from '../model/Sitecore';
import { FieldDefinition } from './ItemInspector';
export interface Blob {
    Value: string;
    BlobID: string;
}
export declare class ItemBuilder {
    private _store;
    private _templateId;
    private _fields;
    private _blobs;
    private _knownDefs;
    constructor(store: IStore, templateItem: IItem | string);
    setFieldByName(name: string, value: any): this;
    setFieldByGUID(fieldId: GUID, value: any): this;
    setFieldWithDetails(fieldId: GUID, name: string, type: string, shared: boolean, unversioned: boolean, value: any): this;
    setField(def: FieldDefinition, value: any): this;
    setBlobByName(name: string, base64: string): this;
    setBlobByGUID(fieldId: GUID, base64: string): this;
    setBlobWithDetails(fieldId: GUID, name: string, type: string, shared: boolean, unversioned: boolean, base64: string): this;
    setBlob(def: FieldDefinition, base64: string): this;
    private _serializeField;
    private _serializeBlob;
    private _serializeFields;
    buildItem(dbName: string, scPath: string, language?: string): IItem;
    static formatDate(date: Date): string;
}
//# sourceMappingURL=ItemBuilder.d.ts.map