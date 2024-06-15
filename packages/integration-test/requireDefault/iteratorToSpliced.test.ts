/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorToSpliced } = require('iter-fest');

test('iteratorToSpliced should work', () =>
  expect(Array.from(iteratorToSpliced([1, 2, 3].values(), 1, 1, 9))).toEqual([1, 9, 3]));
