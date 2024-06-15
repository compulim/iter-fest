/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorFilter } = require('iter-fest');

test('iteratorFilter should work', () =>
  expect(Array.from(iteratorFilter([1, 2, 3].values(), value => value % 2))).toEqual([1, 3]));
