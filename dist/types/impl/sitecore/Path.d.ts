import { IPath } from '../../model/Sitecore';
export declare class Path implements IPath {
    readonly Name: string;
    readonly Folder: string;
    readonly Path: string;
    readonly Tokens: Array<string>;
    constructor(scPath: string);
    rebase(oldRoot: string, newRoot: string): Path;
    relativePath(childPath: IPath): Path;
}
//# sourceMappingURL=Path.d.ts.map