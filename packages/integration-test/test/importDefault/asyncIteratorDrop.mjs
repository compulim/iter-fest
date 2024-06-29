import { expect } from 'expect';
import { asyncIteratorDrop } from 'iter-fest';

describe('asyncIteratorDrop', () => {
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

    const result = asyncIteratorDrop(naturals(), 3);

    await expect(result.next()).resolves.toEqual({ done: false, value: 3 });
    await expect(result.next()).resolves.toEqual({ done: false, value: 4 });
    await expect(result.next()).resolves.toEqual({ done: false, value: 5 });
  });
});
