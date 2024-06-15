/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorEvery } = require('iter-fest/iteratorEvery');

test('iteratorEvery should work', () => expect(iteratorEvery([1, 2, 3].values(), value => value)).toBe(true));
