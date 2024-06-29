import { expect } from 'expect';
import { asyncIteratorForEach, iteratorToAsync } from 'iter-fest';

describe('asyncIteratorForEach', () => {
  it('should work', async () => {
    // Copied from https://github.com/tc39/proposal-iterator-helpers.
    const log = [];
    const fn = async value => void log.push(value);
    const iter = iteratorToAsync([1, 2, 3].values());

    await asyncIteratorForEach(iter, fn);

    expect(log.join(', ')).toBe('1, 2, 3');
  });
});
