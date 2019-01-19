import { IItem } from './Sitecore';
import { IStore } from '../Store';

export type AsyncOperationCallback = (err?: Error | null) => void;

export interface IOperation {
  readonly name: string;
  readonly item: IItem;
  readonly committed: boolean;

  commit(store: IStore): Promise<void>;
}
