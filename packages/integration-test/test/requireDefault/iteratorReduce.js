const { expect } = require('expect');
const { iteratorReduce, iteratorTake } = require('iter-fest');

describe('iteratorReduce', () => {
  it('should work', () => {
    // Copied from https://github.com/tc39/proposal-iterator-helpers.
    function* naturals() {
      let i = 0;

      while (true) {
        yield i;

        i += 1;
      }
    }

    const result = iteratorReduce(
      iteratorTake(naturals(), 5),
      (sum, value) => {
        return sum + value;
      },
      3
    );

    expect(result).toBe(13);
  });
});
