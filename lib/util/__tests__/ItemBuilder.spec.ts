import mockFs from 'mock-fs';
import { loadMockFs } from '../../../test/util';
import { Store } from '../../Store';
import { Bucket } from '../../Bucket';
import { ItemBuilder } from '../ItemBuilder';

describe('ItemBuilder', () => {
  let store: Store;
  let sampleData: any;

  beforeAll(() => {
    sampleData = loadMockFs();
  });

  beforeEach(() => {
    mockFs(sampleData);
    store = new Store();
    store.addBucket(new Bucket('/data/Templates', '/sitecore/templates/Helix/Project', 'master'));
    return store.readAll();
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should build an item from an item template', () => {
    const item = store.getDatabase('master')!.getItem('261918c5-521a-422d-ae59-23f1d39ee0a3')!;
    const builder = new ItemBuilder(store, item);
    builder.setFieldByName('heading', 'This is a test');
    builder.setFieldByName('content', 'of some cool stuff');
    const builtItem = builder.buildItem('master', '/sitecore/templates/Helix/Project/TestBuilder', 'en');
    mockFs.restore();
    expect(builtItem).toMatchSnapshot();
  });
});