import { BucketTree } from "../BucketTree";
import { Bucket } from "../Bucket";

describe('BucketTree', () => {
  let tree: BucketTree;

  beforeEach(() => {
    tree = new BucketTree();
  });

  it('should contain a single bucket', () => {
    tree.addBucket(new Bucket('/data/content', '/sitecore/content', 'master'));
    expect(tree).toMatchSnapshot();
  });

  it('should contain 2 buckets which are siblings', () => {
    tree.addBucket(new Bucket('/data/content', '/sitecore/content/', 'master'));
    tree.addBucket(new Bucket('/data/templates', '/sitecore/templates/', 'master'));
    expect(tree).toMatchSnapshot();
  });

  it('should have a tree of buckets with descendants', () => {
    tree.addBucket(new Bucket('/data/content', '/sitecore/content/', 'master'));
    tree.addBucket(new Bucket('/data/templates', '/sitecore/templates/', 'master'));
    tree.addBucket(new Bucket('/data/helix/content', '/sitecore/content/Helix/', 'master'));
    tree.addBucket(new Bucket('/data/helix/project/test', '/sitecore/content/Helix/Project/TestProject/', 'master'));
    tree.addBucket(new Bucket('/data/helix/foundation/layer.project', '/sitecore/content/Helix/Project/', 'master'));
    tree.addBucket(new Bucket('/data/helix/foundation/layer.foundation', '/sitecore/content/Helix/Foundation/', 'master'));
    expect(tree).toMatchSnapshot();
  });

  it('should fail to add a bucket with a duplicate sitecore path', () => {
    expect(() => {
      tree.addBucket(new Bucket('/data/content1', '/sitecore/content/', 'master'));
      tree.addBucket(new Bucket('/data/content2', '/sitecore/content/', 'master'));
    }).toThrow();
  });

  it('should fail to add a bucket with a duplicate file system path', () => {
    expect(() => {
      tree.addBucket(new Bucket('/data/content1', '/sitecore/content/bucket1', 'master'));
      tree.addBucket(new Bucket('/data/content1', '/sitecore/content/bucket2', 'master'));
    }).toThrow();
  });
});
