/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorSome } = require('iter-fest/iteratorSome');
const { iteratorTake } = require('iter-fest/iteratorTake');

test('iteratorSome should work', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  function* naturals() {
    let i = 0;

    while (true) {
      yield i;

      i += 1;
    }
  }

  const iter = iteratorTake(naturals(), 4);

  expect(iteratorSome(iter, v => v > 1)).toEqual(true);
  expect(iteratorSome(iter, () => true)).toEqual(false); // iterator is already consumed.

  expect(iteratorSome(iteratorTake(naturals(), 4), v => v > 1)).toEqual(true);
  expect(iteratorSome(iteratorTake(naturals(), 4), v => v == 1)).toEqual(true); // acting on a new iterator
});
