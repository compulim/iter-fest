/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorMap } = require('iter-fest/iteratorMap');

test('iteratorMap should work', () =>
  expect(Array.from(iteratorMap([1, 2, 3].values(), value => String.fromCharCode(value + 64)))).toEqual([
    'A',
    'B',
    'C'
  ]));
