import { IItem } from './Sitecore';
import { Bucket } from '../Bucket';

export type AsyncOperationCallback = (err?: Error | null) => void;

export interface IOperation {
  readonly name: string;
  readonly item: IItem;

  commit(bucket: Bucket, cb?: AsyncOperationCallback): void;
}