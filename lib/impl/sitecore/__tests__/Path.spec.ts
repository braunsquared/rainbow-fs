import { Path } from '../Path';

describe('Path', () => {

  it('should parse a path into the appropriate segments', () => {
    const path = new Path('/sitecore/content/this/is/a/test');
    expect(path).toMatchSnapshot();
  });

  it('should throw an error when trying to rebase', () => {
    expect(() => {
      const path = new Path('/sitecore/content/this/is/a/test');
      path.rebase('/sitecore/content/not/a/base', '/site/content/new/base');
    }).toThrow();
  });

  it('should get a relative path', () => {
    const a = new Path('/sitecore/content/this');
    const b = new Path('/sitecore/content/this/is/a/test');
    expect(a.relativePath(b)).toMatchSnapshot();
  });

  it('should throw an error when trying to get a relative path', () => {
    expect(() => {
      const a = new Path('/sitecore/content/that');
      const b = new Path('/sitecore/content/this/is/a/test');
      a.relativePath(b);
    }).toThrow();
  });

});