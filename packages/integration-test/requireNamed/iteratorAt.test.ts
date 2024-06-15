/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorAt } = require('iter-fest/iteratorAt');

test('iteratorAt should work', () => expect(iteratorAt([1, 2, 3].values(), 1)).toBe(2));
