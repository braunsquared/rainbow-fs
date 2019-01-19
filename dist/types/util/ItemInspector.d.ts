import { IStore } from '../Store';
import { IItem, GUID } from '../model/Sitecore';
export interface FieldDefinition {
    ID: GUID;
    Name: string;
    Type: string;
    Shared: boolean;
    Unversioned: boolean;
    Item?: IItem;
}
export interface FieldDefinitionResults {
    errors: Error[];
    fields: FieldDefinition[];
}
declare class ItemInspector {
    static SystemTemplateGUIDs: string[];
    private _store;
    private _item;
    constructor(store: IStore, item: IItem);
    readonly Item: IItem;
    getTemplateItem(): IItem | undefined;
    getStandardValues(): IItem | undefined;
    inspectTemplate(): ItemInspector;
    children(): IItem[];
    fieldDefinitions(): FieldDefinitionResults;
}
export { ItemInspector };
//# sourceMappingURL=ItemInspector.d.ts.map