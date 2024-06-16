import { asyncIteratorSome, asyncIteratorTake } from 'iter-fest';

test('asyncIteratorSome should work', async () => {
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

  const iter = asyncIteratorTake(naturals(), 4);

  await expect(asyncIteratorSome(iter, v => Promise.resolve(v > 1))).resolves.toEqual(true);
  await expect(asyncIteratorSome(iter, () => Promise.resolve(true))).resolves.toEqual(false); // iterator is already consumed.

  await expect(asyncIteratorSome(asyncIteratorTake(naturals(), 4), v => Promise.resolve(v > 1))).resolves.toEqual(true);
  await expect(asyncIteratorSome(asyncIteratorTake(naturals(), 4), v => Promise.resolve(v == 1))).resolves.toEqual(
    true
  ); // acting on a new iterator
});
