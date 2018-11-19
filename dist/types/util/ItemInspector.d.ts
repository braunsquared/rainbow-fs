import { IStore } from '../Store';
import { IItem, GUID } from '../model/Sitecore';
interface FieldDefinition {
    ID: GUID;
    Name: string;
    Type: string;
    Shared: boolean;
    Unversioned: boolean;
    Item?: IItem;
}
interface FieldDefinitionResults {
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
    inspectTemplate(): ItemInspector;
    children(): IItem[];
    fieldDefinitions(): FieldDefinitionResults;
}
export { ItemInspector };
//# sourceMappingURL=ItemInspector.d.ts.map