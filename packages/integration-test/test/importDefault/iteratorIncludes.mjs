import { expect } from 'expect';
import { iteratorIncludes } from 'iter-fest';

describe('iteratorIncludes', () => {
  it('should work', () => expect(iteratorIncludes([1, 2, 3].values(), 2)).toBe(true));
});
