import { expect } from 'expect';
import { iteratorIndexOf } from 'iter-fest/iteratorIndexOf';

describe('iteratorIndexOf', () => {
  it('should work', () => expect(iteratorIndexOf([1, 2, 3].values(), 2)).toBe(1));
});
