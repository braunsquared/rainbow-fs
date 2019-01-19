/// <reference types="node" />
import fs from 'fs';
import { IYamlWriter } from './IYamlWriter';
export declare class YamlWriter implements IYamlWriter {
    private readonly _stream;
    private indentSpaces;
    private indentChar;
    indent: number;
    constructor(stream: fs.WriteStream);
    increaseIndent(): void;
    decreaseIndent(): void;
    writeBeginListItem(key: string, value: string): void;
    writeMap(key: string, value?: string): void;
    writeComment(value: string): void;
    indentMultilineString(indent: number, value: string): string;
    encode(value: string): string;
    private writeMapInternal;
}
//# sourceMappingURL=YamlWriter.d.ts.map