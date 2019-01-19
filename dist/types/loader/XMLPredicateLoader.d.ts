import { IStore } from '../Store';
declare class XMLPredicateLoader {
    private _variables;
    constructor();
    setVariable(key: string, value: string): void;
    replaceVariables(input: string): string;
    normalizePathSeparator(input: string): string;
    load(xmlPath: string, store: IStore): Promise<void>;
}
export { XMLPredicateLoader };
//# sourceMappingURL=XMLPredicateLoader.d.ts.map