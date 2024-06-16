import { asyncIteratorTake } from 'iter-fest';

test('asyncIteratorTake should work', async () => {
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

  const result = asyncIteratorTake(naturals(), 3);

  await expect(result.next()).resolves.toEqual({ done: false, value: 0 });
  await expect(result.next()).resolves.toEqual({ done: false, value: 1 });
  await expect(result.next()).resolves.toEqual({ done: false, value: 2 });
  await expect(result.next()).resolves.toEqual({ done: true, value: undefined });
});
