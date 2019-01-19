import fs from 'fs';
import os from 'os';
import { IYamlWriter } from './IYamlWriter';

export class YamlWriter implements IYamlWriter {
  private readonly _stream: fs.WriteStream;
  private indentSpaces = 2;
  private indentChar = ' ';

  public indent = 0;

  constructor(stream: fs.WriteStream) {
    this._stream = stream;
    this._stream.write(`---${os.EOL}`);
  }

  public increaseIndent() {
    this.indent += this.indentSpaces;
  }

  public decreaseIndent() {
    if (this.indent < this.indentSpaces) throw new Error('Indent already at minimum');

    this.indent -= this.indentSpaces;
  }

  public writeBeginListItem(key: string, value: string) {
    if (this.indent < this.indentSpaces) throw new Error('Indent is at minimum.  You must indent to support a list');
    this._stream.write(`${this.indentChar.repeat(this.indent - 2)}- `);
    this.writeMapInternal(key, value);
  }

  public writeMap(key: string, value?: string) {
    if (typeof value !== 'undefined') {
      this._stream.write(this.indentChar.repeat(this.indent));
      this.writeMapInternal(key, value);
    } else {
      this._stream.write(`${this.indentChar.repeat(this.indent)}${key}:${os.EOL}`);
    }
  }

  public writeComment(value: string) {
    this._stream.write(`${this.indentChar.repeat(this.indent)}# ${value}${os.EOL}`);
  }

  public indentMultilineString(indent: number, value: string): string {
    const indentValue = this.indentChar.repeat(indent);
    let buffer = indentValue;

    for (let i = 0; i < value.length; i += 1) {
      const c = value.charAt(i);
      switch (c) {
        case '\r': {
          if (i < value.length - 1 && value.charAt(i + 1) !== '\n') {
            buffer += `${os.EOL}${indentValue}`;
          }
          break;
        }
        case '\n': {
          buffer += `${os.EOL}${indentValue}`;
          break;
        }
        default: {
          buffer += c;
          break;
        }
      }
    }

    return buffer;
  }

  public encode(value: string): string {
    return `"${value.replace(/"/g, '\\"')}"`;
  }

  private writeMapInternal(key: string, value: string) {
    if (/[\n\r"\\]/.test(value)) {
      this._stream.write(`${key}: |\n${this.indentMultilineString(this.indent + this.indentSpaces, value)}${os.EOL}`);
      return;
    }

    let encoded = value;
    if (/[":\[\]{}!?-]/.test(value)) {
      encoded = this.encode(value);
    }

    this._stream.write(`${key}: ${encoded}${os.EOL}`);
  }
}
