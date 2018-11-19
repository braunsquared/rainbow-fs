import { IField } from '../../model/Sitecore';
export declare class Field implements IField {
    ID: string;
    Hint: string;
    Type?: string;
    Value: any;
    constructor(id: string, hint: string, value: any);
    toObject(): any;
    static fromObject(obj: any): IField;
}
//# sourceMappingURL=Field.d.ts.map