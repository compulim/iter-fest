/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorToAsync } = require('iter-fest/iteratorToAsync');

test('iteratorToAsync should work', async () => {
  const iterator = [1, 2, 3].values();
  const asyncIterator = iteratorToAsync(iterator);

  await expect(asyncIterator.next()).resolves.toEqual({ done: false, value: 1 });
  await expect(asyncIterator.next()).resolves.toEqual({ done: false, value: 2 });
  await expect(asyncIterator.next()).resolves.toEqual({ done: false, value: 3 });
  await expect(asyncIterator.next()).resolves.toEqual({ done: true, value: undefined });
});
