const { iteratorIndexOf } = require('iter-fest/iteratorIndexOf');

test('iteratorIndexOf should work', () => expect(iteratorIndexOf([1, 2, 3].values(), 2)).toBe(1));
