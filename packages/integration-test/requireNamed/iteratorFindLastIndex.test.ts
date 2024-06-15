/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorFindLastIndex } = require('iter-fest/iteratorFindLastIndex');

test('iteratorFindLastIndex should work', () =>
  expect(iteratorFindLastIndex([1, 2, 3].values(), value => value % 2)).toBe(2));
