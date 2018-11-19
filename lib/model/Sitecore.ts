import { IStore } from '../Store';

export type GUID = string | undefined;
export type Hints = Map<Symbol, any>;

export const HintPath = Symbol('path');
export const HintFilename = Symbol('filename');

export type ItemFactory = (store: IStore, obj: any, meta?: ItemMetaData) => IItem;

export interface ISerializable {
  toObject(): any;
}

export interface IPath {
  readonly Name: string;
  readonly Folder: string;
  readonly Path: string;
  readonly Tokens: Array<string>;

  rebase(oldRoot: string, newRoot: string): IPath;
  relativePath(childPath: IPath): IPath;
}

export type ItemMetaData = {
  isNew: boolean;
  isDirty: boolean;
  isVirtual?: boolean;
  hints?: Hints;
  [key: string]: any;
}

export interface IItem extends ISerializable {
  ID: GUID;
  Parent: GUID;
  Template: GUID;
  Path: IPath;
  DB: string;
  SharedFields: Array<IField>;
  Languages: Array<ILanguage>;

  Meta: ItemMetaData;

  addLanguage(lang: ILanguage): this;
  removeLanguage(lang: ILanguage): this;

  addSharedField(field: IField): this;
  removeSharedField(field: IField): this;

  field(idOrName: string, lang?: string): IField | undefined;
}

export interface ILanguage extends ISerializable {
  Language: string;
  Versions: Array<IVersion>;
  Fields: Array<IField>;

  addVersion(version: IVersion): this;
  removeVersion(version: IVersion): this;
  latestVersion(): IVersion | undefined;

  addField(field: IField): this;
  removeField(field: IField): this;

  field(idOrName: string): IField | undefined;
}

export interface IVersion extends ISerializable {
  Version: number;
  Fields: Array<IField>;

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


