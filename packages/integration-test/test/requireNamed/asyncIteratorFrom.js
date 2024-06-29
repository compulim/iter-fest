const { expect } = require('expect');
const { asyncIteratorFrom } = require('iter-fest/asyncIteratorFrom');

describe('asyncIteratorFrom', () => {
  it('should work', async () => {
    // Copied from https://github.com/tc39/proposal-iterator-helpers.
    class Iter {
      next() {
        return Promise.resolve({ done: false, value: 1 });
      }
    }

    const iter = new Iter();
    const wrapper = asyncIteratorFrom(iter);

    await expect(wrapper.next()).resolves.toEqual({ done: false, value: 1 });
  });
});
