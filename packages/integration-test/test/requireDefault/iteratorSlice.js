const { expect } = require('expect');
const { iteratorSlice } = require('iter-fest');

describe('iteratorSlice', () => {
  it('should work', () => expect(Array.from(iteratorSlice([1, 2, 3, 4, 5].values(), 1, 4))).toEqual([2, 3, 4]));
});
