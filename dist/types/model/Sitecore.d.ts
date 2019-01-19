import { IStore } from '../Store';
import { IYamlWriter } from '../io/IYamlWriter';
export declare type GUID = string | undefined;
export declare type Hints = Map<Symbol, any>;
export declare const HintPath: unique symbol;
export declare const HintFilename: unique symbol;
export declare type ItemFactory = (store: IStore, obj: any, meta?: ItemMetaData) => IItem;
export interface ISerializable {
    toObject(): any;
    write(writer: IYamlWriter): void;
}
export interface IPath {
    readonly Name: string;
    readonly Folder: string;
    readonly Path: string;
    readonly Tokens: string[];
    rebase(oldRoot: string, newRoot: string): IPath;
    relativePath(childPath: IPath): IPath;
}
export declare type ItemMetaData = {
    isNew: boolean;
    isDirty: boolean;
    isVirtual?: boolean;
    hints?: Hints;
    [key: string]: any;
};
export interface IItem extends ISerializable {
    ID: GUID;
    Parent: GUID;
    Template: GUID;
    Path: IPath;
    DB: string;
    BranchID: GUID;
    SharedFields: IField[];
    Languages: ILanguage[];
    Meta: ItemMetaData;
    addLanguage(lang: ILanguage): this;
    removeLanguage(lang: ILanguage): this;
    addSharedField(field: IField): this;
    removeSharedField(field: IField): this;
    field(idOrName: string, lang?: string): IField | undefined;
}
export interface ILanguage extends ISerializable {
    Language: string;
    Versions: IVersion[];
    Fields: IField[];
    addVersion(version: IVersion): this;
    removeVersion(version: IVersion): this;
    latestVersion(): IVersion | undefined;
    addField(field: IField): this;
    removeField(field: IField): this;
    field(idOrName: string): IField | undefined;
}
export interface IVersion extends ISerializable {
    Version: number;
    Fields: IField[];
    addField(field: IField): this;
    removeField(field: IField): this;
    field(idOrName: string): IField | undefined;
}
export interface IField extends ISerializable {
    ID: GUID;
    Hint: string;
    Type?: string;
    Value?: string;
}
//# sourceMappingURL=Sitecore.d.ts.map