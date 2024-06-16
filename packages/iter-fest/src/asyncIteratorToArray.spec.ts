import { asyncIteratorTake } from './asyncIteratorTake';
import { asyncIteratorToArray } from './asyncIteratorToArray';

test('should follow TC39 proposal sample (sync)', async () => {
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

  const result = asyncIteratorToArray(asyncIteratorTake(naturals(), 5));

  await expect(result).resolves.toEqual([0, 1, 2, 3, 4]);
});
