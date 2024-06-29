const { expect } = require('expect');
const { asyncIteratorReduce, asyncIteratorTake } = require('iter-fest');

describe('asyncIteratorReduce', () => {
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

    const result = asyncIteratorReduce(
      asyncIteratorTake(naturals(), 5),
      async (sum, value) => {
        return sum + value;
      },
      3
    );

    await expect(result).resolves.toBe(13);
  });
});
