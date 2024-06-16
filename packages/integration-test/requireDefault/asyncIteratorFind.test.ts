/* eslint-disable @typescript-eslint/no-var-requires */
const { asyncIteratorFind } = require('iter-fest');

test('asyncIteratorFind should work', async () => {
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

  await expect(asyncIteratorFind(naturals(), v => Promise.resolve(v > 1))).resolves.toBe(2);
});
