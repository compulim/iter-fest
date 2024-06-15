/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorToString } = require('iter-fest/iteratorToString');

test('iteratorToString should work', () => expect(iteratorToString([1, 2, 3].values())).toBe('1,2,3'));
