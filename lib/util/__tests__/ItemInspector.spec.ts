import mockfs from 'mock-fs';
import fs from 'fs';
import { loadMockFs } from '../../../test/util';
import { Store } from '../../Store';
import { Bucket } from '../../Bucket';
import { ItemInspector } from '../ItemInspector';

describe('ItemInspector', () => {
  let store: Store;
  let bucket: Bucket;
  let sampleData: any;

  beforeAll(() => {
    sampleData = loadMockFs();
  });

  beforeEach(() => {
    mockfs(sampleData);
    store = new Store();
    store.addBucket(new Bucket('/data/Templates', '/sitecore/templates/Helix/Project', 'master'));
    return store.readAll();
  });

  afterEach(() => {
    mockfs.restore();
  });

  it('should inspect an items field definitions', () => {
    const item = store.getDatabase('master')!.getItem('261918c5-521a-422d-ae59-23f1d39ee0a3')!;
    const inspect = new ItemInspector(store, item);
    mockfs.restore();
    expect(inspect.fieldDefinitions()).toMatchSnapshot();
  });
});