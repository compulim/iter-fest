const { expect } = require('expect');
const { iteratorDrop } = require('iter-fest/iteratorDrop');

describe('iteratorDrop', () => {
  it('should work', () => {
    // Copied from https://github.com/tc39/proposal-iterator-helpers.
    function* naturals() {
      let i = 0;

      while (true) {
        yield i;

        i += 1;
      }
    }

    const result = iteratorDrop(naturals(), 3);

    expect(result.next()).toEqual({ done: false, value: 3 });
    expect(result.next()).toEqual({ done: false, value: 4 });
    expect(result.next()).toEqual({ done: false, value: 5 });
  });
});
