import { expect } from 'expect';
import { iteratorFindLastIndex } from 'iter-fest/iteratorFindLastIndex';

describe('iteratorFindLastIndex', () => {
  it('should work', () => expect(iteratorFindLastIndex([1, 2, 3].values(), value => value % 2)).toBe(2));
});
