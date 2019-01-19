import { IDb } from '../../model/Database';
import { IItem, GUID } from '../../model/Sitecore';
import { IOperation } from '../../model/Operation';
import { IStore } from '../../Store';
export declare function memoryDbFactory(name: string): IDb;
export declare class MemoryDb implements IDb {
    readonly name: string;
    private _items;
    private _proxyHandler;
    private _ops;
    constructor(name: string);
    readonly items: Map<GUID, IItem>;
    getItem(id: GUID): IItem | undefined;
    addItem(item: IItem): IItem;
    removeItem(item: IItem): IItem;
    notifyChange(item: IItem, prop: string, oldValue: any, newValue: any): void;
    readonly isDirty: boolean;
    readonly operations: IOperation[];
    operationCount(): number;
    commit(store: IStore): Promise<void>;
}
//# sourceMappingURL=MemoryDb.d.ts.map