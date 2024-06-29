const { expect } = require('expect');
const { iteratorTake } = require('iter-fest/iteratorTake');
const { iteratorToArray } = require('iter-fest/iteratorToArray');

describe('iteratorToArray', () => {
  it('should work', () => {
    // Copied from https://github.com/tc39/proposal-iterator-helpers.
    function* naturals() {
      let i = 0;

      while (true) {
        yield i;

        i += 1;
      }
    }

    const result = iteratorToArray(iteratorTake(naturals(), 5));

    expect(result).toEqual([0, 1, 2, 3, 4]);
  });
});
