export declare const sep = "/";
export declare function normalize(path: string): string;
export declare function join(...elements: (string | undefined)[]): string;
export declare function split(path: string): string[];
export interface ParsedPath {
    name: string;
    base: string;
    path: string;
    tokens: string[];
}
export declare function parse(path: string): ParsedPath;
//# sourceMappingURL=path.d.ts.map