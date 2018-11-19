import path from 'path';
import mockfs from 'mock-fs';
import { Store, IStore } from '../../Store';
import { XMLPredicateLoader } from '../XMLPredicateLoader';
import { loadMockFs } from '../../../test/util';

describe('XMLPredicateLoader', () => {
  let store: IStore;
  let loader: XMLPredicateLoader;
  let sampleData: any;

  beforeAll(() => {
    sampleData = loadMockFs();
  });

  beforeEach(() => {
    mockfs(sampleData);
    store = new Store();
    loader = new XMLPredicateLoader();
  });

  afterEach(() => {
    mockfs.restore();
  })

  it('should load predicates from an xml config file', () => {
    loader.setVariable('dataFolder', '');
    return loader.load('/xml/SampleData.Serialization.config', store).then(() => {
      mockfs.restore();
      expect((<Store>store).trees).toMatchSnapshot();
    });
  });
});