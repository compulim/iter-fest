const { expect } = require('expect');
const { iteratorForEach } = require('iter-fest');

describe('iteratorForEach', () => {
  it('should work', () => {
    // Copied from https://github.com/tc39/proposal-iterator-helpers.
    const log = [];
    const fn = value => log.push(value);
    const iter = [1, 2, 3].values();

    iteratorForEach(iter, fn);

    expect(log.join(', ')).toBe('1, 2, 3');
  });
});
