import { expect } from 'expect';
import { iteratorFilter } from 'iter-fest/iteratorFilter';

describe('iteratorFilter', () => {
  it('should work', () => {
    // Copied from https://github.com/tc39/proposal-iterator-helpers.
    function* naturals() {
      let i = 0;

      while (true) {
        yield i;

        i += 1;
      }
    }

    const result = iteratorFilter(naturals(), value => {
      return value % 2 == 0;
    });

    expect(result.next()).toEqual({ done: false, value: 0 });
    expect(result.next()).toEqual({ done: false, value: 2 });
    expect(result.next()).toEqual({ done: false, value: 4 });
  });
});
