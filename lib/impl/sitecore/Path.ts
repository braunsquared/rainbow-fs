import * as path from '../../util/path';
import { IPath } from '../../model/Sitecore';

export class Path implements IPath {
  readonly Name: string;
  readonly Folder: string;
  readonly Path: string;
  readonly Tokens: Array<string>;

  constructor(scPath: string) {
    const parsed = path.parse(scPath);
    this.Name = parsed.name;
    this.Folder = parsed.base;
    this.Path = parsed.path;
    this.Tokens = parsed.tokens;
  }

  rebase(oldRoot: string, newRoot: string): Path {
    // TODO: handle the fact that sitecore is not case sensitive
    if (!this.Path.startsWith(oldRoot)) {
      throw new Error('Unable to rebase when old root does not match');
    }

    return new Path(`${newRoot}/${this.Path.substring(oldRoot.length)}`);
  }

  relativePath(childPath: IPath): Path {
    if (!childPath.Path.startsWith(this.Path)) {
      throw new Error('Path is not a base of the child path');
    }

    return new Path(childPath.Path.substring(this.Path.length));
  }
}