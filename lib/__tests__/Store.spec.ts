import mockfs from 'mock-fs';
import path from 'path';

import { Store, IStore } from '../Store';
import { XMLPredicateLoader } from '../loader/XMLPredicateLoader';
import { loadMockFs } from '../../test/util';

describe('Store', () => {
  let store: IStore;
  let sampleData: any;

  beforeAll(() => {
    sampleData = loadMockFs();
  });

  beforeEach(() => {
    mockfs(sampleData);

    store = new Store();

    const loader = new XMLPredicateLoader();
    loader.setVariable('dataFolder', '/');
    return loader.load('/xml/SampleData.Serialization.config', store);
  });

  afterEach(() => {
    mockfs.restore();
  })

  it('should read all the buckets', () => {
    return store.readAll().then(() => {
      mockfs.restore();
      expect(store).toMatchSnapshot();
    });
  });

  it('should match against a glob pattern', () => {
    return store.readAll().then(() => {
      const items = store.glob('**/Renderings/**');
      mockfs.restore();
      expect(items).toMatchSnapshot();
    });
  });

  it('should match against a glob pattern scoped to a db', () => {
    return store.readAll().then(() => {
      const a = store.glob('**/Renderings/**/Global*', 'master');
      const b = store.glob('**/Renderings/**/Global*', ['master']);
      mockfs.restore();
      expect(a).toMatchSnapshot('items');
      expect(b).toMatchSnapshot('items');
    });
  });

  it('should fail to match against an invalid db', () => {
    return store.readAll().then(() => {
      expect(() => {
        store.glob('**/Renderings/**', 'web');
      }).toThrow();
    });
  });

  it('should find a field by name using the default language', () => {
    return store.readAll().then(() => {
      const items = store.glob('**/Renderings/**/GlobalNav');
      mockfs.restore();
      expect(items.length).toEqual(1);
      const field = items[0].field('ComponentQuery');
      expect(field).toMatchSnapshot();
    });
  });

  it('should find a field by name using a specified language', () => {
    return store.readAll().then(() => {
      const items = store.glob('**/Renderings/**/GlobalNav');
      mockfs.restore();
      expect(items.length).toEqual(1);
      const field = items[0].field('ComponentQuery', 'en');
      expect(field).toMatchSnapshot();
    });
  });

  it('should find a field by id using the default language', () => {
    return store.readAll().then(() => {
      const items = store.glob('**/Renderings/**/GlobalNav');
      mockfs.restore();
      expect(items.length).toEqual(1);
      const field = items[0].field('17bb046a-a32a-41b3-8315-81217947611b');
      expect(field).toMatchSnapshot();
    });
  });

  it('should find a field by id using the a specified language', () => {
    return store.readAll().then(() => {
      const items = store.glob('**/Renderings/**/GlobalNav');
      mockfs.restore();
      expect(items.length).toEqual(1);
      const field = items[0].field('17bb046a-a32a-41b3-8315-81217947611b', 'en');
      expect(field).toMatchSnapshot();
    });
  });
});