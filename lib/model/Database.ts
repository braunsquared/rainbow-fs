import { IItem, GUID, Hints } from './Sitecore';
import { IOperation } from './Operation';

export type DatabaseFactory = (name: string) => IDb;

export interface IDb {
  readonly name: string;
  items: Map<GUID, IItem>;

  addItem(item: IItem): IItem;
  removeItem(item: IItem): IItem;
  getItem(id: GUID, hints?: Hints): IItem | undefined;

  notifyChange(item: IItem, prop: string, oldValue: any, newValue: any): void;

  isDirty: boolean;
  operations: Array<IOperation>;
  operationCount(): number;
}