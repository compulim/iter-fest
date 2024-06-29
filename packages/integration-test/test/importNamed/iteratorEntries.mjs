import { expect } from 'expect';
import { iteratorEntries } from 'iter-fest/iteratorEntries';

describe('iteratorEntries', () => {
  it('should work', () =>
    expect(Array.from(iteratorEntries(['A', 'B', 'C'].values()))).toEqual([
      [0, 'A'],
      [1, 'B'],
      [2, 'C']
    ]));
});
