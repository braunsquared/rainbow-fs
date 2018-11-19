import { Item } from './Item';
import { IField, ILanguage } from '../../model/Sitecore';

export class VirtualItem extends Item {
  Meta = {
    isNew: false,
    isDirty: false,
    isVirtual: true,
  }

  addSharedField(field: IField): this {
    throw new Error('Unable to perform action on virtual item.');
  }

  removeSharedField(field: IField): this {
    throw new Error('Unable to perform action on virtual item.');
  }

  addLanguage(lang: ILanguage): this {
    throw new Error('Unable to perform action on virtual item.');
  }

  removeLanguage(lang: ILanguage): this {
    throw new Error('Unable to perform action on virtual item.');
  }
}