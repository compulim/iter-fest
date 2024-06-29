import { expect } from 'expect';
import { iteratorFrom } from 'iter-fest/iteratorFrom';

describe('iteratorFrom', () => {
  it('should work', () => {
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
});
