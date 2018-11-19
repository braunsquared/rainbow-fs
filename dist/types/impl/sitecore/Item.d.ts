import { GUID, IItem, IPath, ILanguage, IField, ItemMetaData } from '../../model/Sitecore';
import { IStore } from '../../Store';
export declare function defaultItemFactory(store: IStore, obj: any, meta?: ItemMetaData): IItem;
export declare class Item implements IItem {
    ID: GUID;
    Parent: GUID;
    Template: GUID;
    Path: IPath;
    DB: string;
    SharedFields: Array<IField>;
    Languages: Array<ILanguage>;
    Meta: ItemMetaData;
    constructor(id: GUID, path: string);
    addSharedField(field: IField): this;
    removeSharedField(field: IField): this;
    addLanguage(lang: ILanguage): this;
    removeLanguage(lang: ILanguage): this;
    field(idOrName: string, lang?: string): IField | undefined;
    toObject(): any;
    static fromObject(obj: any): Item;
}
//# sourceMappingURL=Item.d.ts.map