const { expect } = require('expect');
const { iteratorMap } = require('iter-fest/iteratorMap');

describe('iteratorMap', () => {
  it('should work', () => {
    // Copied from https://github.com/tc39/proposal-iterator-helpers.
    function* naturals() {
      let i = 0;

      while (true) {
        yield i;

        i += 1;
      }
    }

    const result = iteratorMap(naturals(), value => {
      return value * value;
    });

    expect(result.next()).toEqual({ done: false, value: 0 });
    expect(result.next()).toEqual({ done: false, value: 1 });
    expect(result.next()).toEqual({ done: false, value: 4 });
  });
});
