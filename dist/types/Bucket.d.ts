import { IStore } from './Store';
import { Path } from './impl/sitecore/Path';
import { IItem, IPath } from './model/Sitecore';
export declare type ErrorCallbackValue = Error | null | undefined;
export declare class Bucket {
    Filepath: string;
    Path: Path;
    DB: string;
    constructor(filepath: string, sitecorePath: string, db: string);
    convertItemPath(scPath: IPath): string;
    read(store: IStore): Promise<void>;
    write(item: IItem): Promise<void>;
}
//# sourceMappingURL=Bucket.d.ts.map