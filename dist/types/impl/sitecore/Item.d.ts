import { GUID, IItem, IPath, ILanguage, IField, ItemMetaData } from '../../model/Sitecore';
import { IStore } from '../../Store';
import { IYamlWriter } from '../../io/IYamlWriter';
export declare function defaultItemFactory(store: IStore, obj: any, meta?: ItemMetaData): IItem;
export declare class Item implements IItem {
    ID: GUID;
    Parent: GUID;
    Template: GUID;
    Path: IPath;
    DB: string;
    BranchID: GUID;
    SharedFields: IField[];
    Languages: ILanguage[];
    Meta: ItemMetaData;
    constructor(id: GUID, path: string);
    addSharedField(field: IField): this;
    removeSharedField(field: IField): this;
    addLanguage(lang: ILanguage): this;
    removeLanguage(lang: ILanguage): this;
    field(idOrName: string, lang?: string): IField | undefined;
    toObject(): any;
    write(writer: IYamlWriter): void;
    static fromObject(obj: any): Item;
}
//# sourceMappingURL=Item.d.ts.map