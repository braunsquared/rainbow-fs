import { IVersion, IField } from '../../model/Sitecore';
export declare class Version implements IVersion {
    Version: number;
    Fields: Array<IField>;
    constructor(version: number);
    addField(field: IField): this;
    removeField(field: IField): this;
    field(idOrName: string): IField | undefined;
    toObject(): any;
    static fromObject(obj: any): Version;
}
//# sourceMappingURL=Version.d.ts.map