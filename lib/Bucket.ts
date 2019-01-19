import fsExtra from 'fs-extra';
import jsYaml from 'js-yaml';
// tslint:disable-next-line:import-name
import fsPath from 'path';
import glob from 'glob';
import util from 'util';
import debug from 'debug';

import { IStore } from './Store';
import { Path } from './impl/sitecore/Path';
import { VirtualItem } from './impl/sitecore/VirtualItem';
import { HintFilename, IItem, IPath } from './model/Sitecore';
import { YamlWriter } from './io/YamlWriter';

export type ErrorCallbackValue = Error | null | undefined;

const _log = debug('rainbow-fs:bucket');

const readFile = util.promisify<string, Buffer>(fsExtra.readFile);
const mkdirp = util.promisify<string>(fsExtra.mkdirp);
const unlink = util.promisify<string>(fsExtra.unlink);
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

  convertItemPath(item: IItem): string {
    const scPath = item.Path;
    const deltaPath = new Path(scPath.Folder.substring(this.Path.Folder.length));
    const itemFilePath = fsPath.join(this.Filepath, deltaPath.Path, `${scPath.Name}.yml`);

    if (itemFilePath.length > 110 && item.Parent) {
      return fsPath.join(this.Filepath, item.Parent.toLowerCase(), `${scPath.Name}.yml`);
    }

    return itemFilePath;
  }

  async read(store: IStore) {
    if (!this.Filepath) {
      throw new Error('Filepath is not set. Unable to read from file system.');
    }

    const files = await asyncGlob(fsPath.join(this.Filepath, '**/*.yml'));

    for (let i = 0; i < files.length; i = i + 1) {
      const file = files[i];
      const buffer: Buffer = await readFile(file);
      const content = jsYaml.safeLoad(buffer.toString('utf8'), {filename: file});
      const item = store.createItemFromObject(content, {
        isNew: false,
        isDirty: false,
        hints: new Map([[HintFilename, file]]),
      });

      if (item.DB !== this.DB) {
        _log('WARNING: Found item in bucket from different DB');
        return;
      }

      if (item.Path.Folder === this.Path.Path && item.Parent) {
        // We may be able to infer some information about our item
        const db = store.getDatabase(item.DB);
        if (!db) {
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
    if (item.Meta.isVirtual) {
      throw new Error('Unable to serialize virtual items');
    } else if (!item.Path.Path.startsWith(this.Path.Path)) {
      throw new Error('Item is not a descendant of this bucket');
    } else if (item.DB !== this.DB) {
      throw new Error('Item DB does not match the Bucket DB');
    }

    // Figure out what the path should be
    const itemPath = this.convertItemPath(item);
    const basePath = fsPath.dirname(itemPath);

    _log(`Writing item ${item.ID} to ${itemPath}`);

    await mkdirp(basePath);
    await new Promise((resolve, reject) => {
      const stream = fsExtra.createWriteStream(itemPath, { encoding: 'utf-8' });
      const writer = new YamlWriter(stream);
      item.write(writer);
      stream.end(() => {
        resolve();
      });
    });
  }

  async unlink(item: IItem) {
    if (item.Meta.isVirtual) {
      throw new Error('Unable to delete virtual items');
    } else if (!item.Path.Path.startsWith(this.Path.Path)) {
      throw new Error('Item is not a descendant of this bucket');
    } else if (item.DB !== this.DB) {
      throw new Error('Item DB does not match the Bucket DB');
    }

    const itemPath = this.convertItemPath(item);
    if (fsExtra.existsSync(itemPath)) {
      await unlink(itemPath);
    }
  }
}
