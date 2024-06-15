/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorFindIndex } = require('iter-fest');

test('iteratorFindIndex should work', () => expect(iteratorFindIndex([1, 2, 3].values(), value => value % 2)).toBe(0));
