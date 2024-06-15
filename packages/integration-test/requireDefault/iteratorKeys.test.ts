/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorKeys } = require('iter-fest');

test('iteratorKeys should work', () => expect(Array.from(iteratorKeys(['A', 'B', 'C'].values()))).toEqual([0, 1, 2]));
