import { ILanguage, IVersion, IField } from '../../model/Sitecore';
import { IYamlWriter } from '../../io/IYamlWriter';
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
    write(writer: IYamlWriter): void;
    static fromObject(obj: any): Language;
}
//# sourceMappingURL=Language.d.ts.map