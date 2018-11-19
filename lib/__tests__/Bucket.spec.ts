import mockfs from 'mock-fs';
import fs from 'fs';
import { Store } from '../Store';
import { Bucket } from "../Bucket";
import { Item } from '../impl/sitecore/Item';
import { loadMockFs } from '../../test/util';

function itemToString(item: Item, indent: number = 0, output: string = ''): string {
  // let next = output;
  // next += Array(indent + 1).join(' ') + item.Path.Path + os.EOL;
  // item.children.forEach(child => {
  //   next = itemToString(child, indent + 2, next);
  // });
  // return next;
  return '';
}

describe('Bucket', () => {
  let bucket: Bucket;
  let store: Store;
  let sampleData: any;

  beforeAll(() => {
    sampleData = loadMockFs();
  });

  beforeEach(() => {
    mockfs(sampleData);
    store = new Store();
    bucket = new Bucket('/data/Templates', '/sitecore/templates/Helix/Project', 'master');
  });

  afterEach(() => {
    mockfs.restore();
  })

  it('should read a directory', () => {
    return bucket.read(store).then(() => {
      mockfs.restore();
      expect(store).toMatchSnapshot();
    });
  });

  it('should fail to read when no file path is set', () => {
    bucket.Filepath = '';
    expect(bucket.read(store)).rejects.toThrow();
  });

  it('should write an updated item to disk', () => {
    return bucket.read(store).then(() => {
      const db = store.getDatabase('master');
      expect(db).not.toBeNull();

      const item = db!.getItem('261918c5-521a-422d-ae59-23f1d39ee0a3');
      expect(item).not.toBeNull();

      return bucket.write(item!).then(() => {
        const contents = fs.readFileSync(bucket.convertItemPath(item!.Path), {encoding: 'utf8'});
        mockfs.restore();
        expect(contents).toMatchSnapshot();
      });
    });
  });

  it('should fail to write a virtual item to disk', () => {
    return bucket.read(store).then(() => {
      const db = store.getDatabase('master');
      expect(db).not.toBeNull();

      const item = db!.getItem('0725a327-cd61-14f8-8aed-8d74b9917c6c');
      expect(item).not.toBeNull();

      expect(item!.Meta.isVirtual).toEqual(true);
      return expect(bucket.write(item!)).rejects.toThrow();
    });
  });

  it('should fail to write a non child item to disk', () => {
    return bucket.read(store).then(() => {
      const other = new Bucket('/data/Renderings', '/sitecore/layout/Renderings/Project/TestProject', 'master');
      return other.read(store).then(() => {
        const db = store.getDatabase('master');
        expect(db).not.toBeNull();

        const item = db!.getItem('87120214-1be8-7c76-05c1-eaebfbffec1d');
        expect(item).not.toBeNull();
        return expect(bucket.write(item!)).rejects.toThrow();
      });
    });
  });

  it('should fail to write an item from a different DB', () => {
    return bucket.read(store).then(() => {
      const db = store.getDatabase('master');
      expect(db).not.toBeNull();

      const item = db!.getItem('261918c5-521a-422d-ae59-23f1d39ee0a3');
      expect(item).not.toBeNull();

      item!.DB = 'core';

      return expect(bucket.write(item!)).rejects.toThrow();
    });
  });
});