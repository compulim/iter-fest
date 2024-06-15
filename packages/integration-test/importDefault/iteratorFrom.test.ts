import { iteratorFrom } from 'iter-fest';

test('iteratorFrom', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  class Iter {
    next() {
      return { done: false, value: 1 };
    }
  }

  const iter = new Iter();
  const wrapper = iteratorFrom(iter);

  expect(wrapper.next()).toEqual({ done: false, value: 1 });
});
