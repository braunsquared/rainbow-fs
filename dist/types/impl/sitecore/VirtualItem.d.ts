import { Item } from './Item';
import { IField, ILanguage } from '../../model/Sitecore';
export declare class VirtualItem extends Item {
    Meta: {
        isNew: boolean;
        isDirty: boolean;
        isVirtual: boolean;
    };
    addSharedField(field: IField): this;
    removeSharedField(field: IField): this;
    addLanguage(lang: ILanguage): this;
    removeLanguage(lang: ILanguage): this;
}
//# sourceMappingURL=VirtualItem.d.ts.map