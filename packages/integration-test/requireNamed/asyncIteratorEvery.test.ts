/* eslint-disable @typescript-eslint/no-var-requires */
const { asyncIteratorEvery } = require('iter-fest/asyncIteratorEvery');
const { asyncIteratorTake } = require('iter-fest/asyncIteratorTake');

test('asyncIteratorEvery should work', async () => {
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

  const iter = asyncIteratorTake(naturals(), 10);

  await expect(asyncIteratorEvery(iter, v => Promise.resolve(v >= 0))).resolves.toBe(true);
  await expect(asyncIteratorEvery(iter, () => Promise.resolve(false))).resolves.toBe(true); // iterator is already consumed.

  await expect(asyncIteratorEvery(asyncIteratorTake(naturals(), 4), v => Promise.resolve(v > 0))).resolves.toEqual(
    false
  ); // first value is 0
  await expect(asyncIteratorEvery(asyncIteratorTake(naturals(), 4), v => Promise.resolve(v >= 0))).resolves.toEqual(
    true
  ); // acting on a new iterator
});
