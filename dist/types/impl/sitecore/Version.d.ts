import { IVersion, IField } from '../../model/Sitecore';
import { IYamlWriter } from '../../io/IYamlWriter';
export declare class Version implements IVersion {
    Version: number;
    Fields: IField[];
    constructor(version: number);
    addField(field: IField): this;
    removeField(field: IField): this;
    field(idOrName: string): IField | undefined;
    toObject(): any;
    write(writer: IYamlWriter): void;
    static fromObject(obj: any): Version;
}
//# sourceMappingURL=Version.d.ts.map