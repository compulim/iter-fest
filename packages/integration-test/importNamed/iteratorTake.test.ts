import { iteratorTake } from 'iter-fest/iteratorTake';

test('iteratorTake should work', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  function* naturals() {
    let i = 0;

    while (true) {
      yield i;

      i += 1;
    }
  }

  const result = iteratorTake(naturals(), 3);

  expect(result.next()).toEqual({ done: false, value: 0 });
  expect(result.next()).toEqual({ done: false, value: 1 });
  expect(result.next()).toEqual({ done: false, value: 2 });
  expect(result.next()).toEqual({ done: true, value: undefined });
});
