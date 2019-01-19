import { IField } from '../../model/Sitecore';
import { IYamlWriter } from '../../io/IYamlWriter';
export declare class Field implements IField {
    ID: string;
    Hint: string;
    Type?: string;
    BlobID?: string;
    Value: any;
    constructor(id: string, hint: string, value: any);
    toObject(): any;
    write(writer: IYamlWriter): void;
    static fromObject(obj: any): IField;
}
//# sourceMappingURL=Field.d.ts.map