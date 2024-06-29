import { expect } from 'expect';
import { iteratorKeys } from 'iter-fest';

describe('iteratorKeys', () => {
  it('should work', () => expect(Array.from(iteratorKeys(['A', 'B', 'C'].values()))).toEqual([0, 1, 2]));
});
