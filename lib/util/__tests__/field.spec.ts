import { Field } from '../../impl/sitecore/Field';
import { treelistValue } from '../field';

describe('field util', () => {
  it('should parse a treelist value with a single item', () => {
    const field = new Field('abc', '', '{1930BBEB-7805-471A-A3BE-4858AC7CF696}');
    expect(treelistValue(field)).toMatchSnapshot();
  });

  it('should parse a treelist value with multiple item', () => {
    const field = new Field('abc', '', '{1930BBEB-7805-471A-A3BE-4858AC7CF696}\n{B9764823-CF16-4E03-BEAA-C0EABED31D6C}\n');
    expect(treelistValue(field)).toMatchSnapshot();
  });
});