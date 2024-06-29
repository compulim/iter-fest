const { expect } = require('expect');
const { asyncIteratorFilter } = require('iter-fest/asyncIteratorFilter');

describe('asyncIteratorFilter', () => {
  it('should work', async () => {
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

    const result = asyncIteratorFilter(naturals(), value => {
      return value % 2 == 0;
    });

    await expect(result.next()).resolves.toEqual({ done: false, value: 0 });
    await expect(result.next()).resolves.toEqual({ done: false, value: 2 });
    await expect(result.next()).resolves.toEqual({ done: false, value: 4 });
  });
});
