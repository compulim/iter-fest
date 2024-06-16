import { asyncIteratorMap } from 'iter-fest/asyncIteratorMap';

test('asyncIteratorMap should work', async () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  async function* naturals() {
    await 0;
    let i = 0;

    while (true) {
      await 0;
      yield i;

      i += 1;
    }
  }

  const result = asyncIteratorMap(naturals(), value => {
    return value * value;
  });

  await expect(result.next()).resolves.toEqual({ done: false, value: 0 });
  await expect(result.next()).resolves.toEqual({ done: false, value: 1 });
  await expect(result.next()).resolves.toEqual({ done: false, value: 4 });
});
