import { iteratorFrom } from './iteratorFrom';

test('should follow TC39 proposal sample', () => {
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
