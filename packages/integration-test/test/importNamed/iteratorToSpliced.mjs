import { expect } from 'expect';
import { iteratorToSpliced } from 'iter-fest/iteratorToSpliced';

describe('iteratorToSpliced', () => {
  it('should work', () => expect(Array.from(iteratorToSpliced([1, 2, 3].values(), 1, 1, 9))).toEqual([1, 9, 3]));
});
