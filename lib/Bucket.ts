import fs from 'fs-extra';
import yaml from 'js-yaml';
import fsPath from 'path';
import glob from 'glob';
import util from 'util';

import { IStore } from './Store';
import { Path } from './impl/sitecore/Path';
import { VirtualItem } from './impl/sitecore/VirtualItem';
import { HintFilename, IItem, IPath } from './model/Sitecore';

export type ErrorCallbackValue = Error | null | undefined;

const readFile = util.promisify<string, Buffer>(fs.readFile);
const writeFile = util.promisify<string, string>(fs.writeFile);
const mkdirp = util.promisify<string>(fs.mkdirp);
const asyncGlob = util.promisify<string, string[]>(glob);

export class Bucket{
  Filepath: string;
  Path: Path;
  DB: string;

  constructor(filepath: string, sitecorePath: string, db: string) {
    this.Filepath = filepath;
    this.Path = new Path(sitecorePath);
    this.DB = db;
  }

  convertItemPath(scPath: IPath): string {
    const deltaPath = new Path(scPath.Folder.substring(this.Path.Path.length));
    return fsPath.join(this.Filepath, deltaPath.Path, `${scPath.Name}.yml`);
  }

  async read(store: IStore) {
    if (!this.Filepath) {
      throw new Error("Filepath is not set. Unable to read from file system.");
    }

    const files = await asyncGlob(fsPath.join(this.Filepath, '**/*.yml'));

    for(let i = 0; i < files.length; ++i) {
      const file = files[i];
      const buffer: Buffer = await readFile(file);
      const content = yaml.safeLoad(buffer.toString('utf8'), {filename: file});
      const item = store.createItemFromObject(content, {
        isNew: false,
        isDirty: false,
        hints: new Map([[HintFilename, file]]),
      });

      if(item.DB !== this.DB) {
        console.warn('Found item in bucket from different DB');
        return;
      }

      if(item.Path.Folder === this.Path.Path && item.Parent) {
        // We may be able to infer some information about our item
        const db = store.getDatabase(item.DB);
        if(!db) {
          throw new Error('Database should not be null');
        }

        let bucketItem = db.getItem(item.Parent);
        if (!bucketItem) {
          bucketItem = new VirtualItem(item.Parent, this.Path.Path);
          db.addItem(bucketItem);
        }
      }
    }
  }

  async write(item: IItem) {
    if(item.Meta.isVirtual) {
      throw new Error('Unable to serialize virtual items');
    } else if(!item.Path.Path.startsWith(this.Path.Path)) {
      throw new Error('Item is not a descendant of this bucket');
    } else if(item.DB !== this.DB) {
      throw new Error('Item DB does not match the Bucket DB');
    }

    // Figure out what the path should be
    const itemPath = this.convertItemPath(item.Path);
    const basePath = fsPath.dirname(itemPath);

    await mkdirp(basePath);
    await writeFile(itemPath, yaml.safeDump(item.toObject()));
  }
}
