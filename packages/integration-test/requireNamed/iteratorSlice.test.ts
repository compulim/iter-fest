const { iteratorSlice } = require('iter-fest/iteratorSlice');

test('iteratorSlice should work', () =>
  expect(Array.from(iteratorSlice([1, 2, 3, 4, 5].values(), 1, 4))).toEqual([2, 3, 4]));
