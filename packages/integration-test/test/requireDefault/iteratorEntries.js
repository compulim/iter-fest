const { expect } = require('expect');
const { iteratorEntries } = require('iter-fest');

describe('iteratorEntries', () => {
  it('should work', () =>
    expect(Array.from(iteratorEntries(['A', 'B', 'C'].values()))).toEqual([
      [0, 'A'],
      [1, 'B'],
      [2, 'C']
    ]));
});
