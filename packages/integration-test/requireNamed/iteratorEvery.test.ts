/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorEvery } = require('iter-fest/iteratorEvery');
const { iteratorTake } = require('iter-fest/iteratorTake');

test('iteratorEvery should work', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  function* naturals() {
    let i = 0;

    while (true) {
      yield i;

      i += 1;
    }
  }

  const iter = iteratorTake(naturals(), 10);

  expect(iteratorEvery(iter, v => v >= 0)).toBe(true);
  expect(iteratorEvery(iter, () => false)).toBe(true); // iterator is already consumed.

  expect(iteratorEvery(iteratorTake(naturals(), 4), v => v > 0)).toEqual(false); // first value is 0
  expect(iteratorEvery(iteratorTake(naturals(), 4), v => v >= 0)).toEqual(true); // acting on a new iterator
});
