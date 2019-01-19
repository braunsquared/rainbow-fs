import { IItem } from '../../model/Sitecore';
import { IDb } from '../../model/Database';
export declare class ItemProxyHandler implements ProxyHandler<IItem> {
    db: IDb;
    constructor(db: IDb);
    set(target: IItem, prop: PropertyKey, value: any, receiver?: any): boolean;
    get(target: IItem, prop: PropertyKey, receiver?: any): any;
    wrap(item: IItem): IItem;
}
//# sourceMappingURL=ItemProxyHandler.d.ts.map