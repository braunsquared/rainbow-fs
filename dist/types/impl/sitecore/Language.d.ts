import { ILanguage, IVersion, IField } from '../../model/Sitecore';
export declare class Language implements ILanguage {
    Language: string;
    Fields: Array<IField>;
    Versions: Array<IVersion>;
    constructor(lang: string);
    addVersion(v: IVersion): this;
    removeVersion(v: IVersion): this;
    latestVersion(): IVersion | undefined;
    addField(field: IField): this;
    removeField(field: IField): this;
    field(idOrName: string): IField | undefined;
    toObject(): any;
    static fromObject(obj: any): Language;
}
//# sourceMappingURL=Language.d.ts.map