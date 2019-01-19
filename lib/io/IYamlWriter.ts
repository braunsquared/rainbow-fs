
export interface IYamlWriter {
  increaseIndent(): void;
  decreaseIndent(): void;
  writeBeginListItem(key: string, value: string): void;
  writeMap(key: string, value?: string): void;
  writeComment(value: string): void;
}
