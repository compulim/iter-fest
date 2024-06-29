const { expect } = require('expect');
const { iteratorFind } = require('iter-fest');

describe('iteratorFind', () => {
  it('should work', () => {
    // Copied from https://github.com/tc39/proposal-iterator-helpers.
    function* naturals() {
      let i = 0;

      while (true) {
        yield i;

        i += 1;
      }
    }

    expect(iteratorFind(naturals(), v => v > 1)).toBe(2);
  });
});
