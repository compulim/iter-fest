import { expect } from 'expect';
import { asyncIteratorForEach } from 'iter-fest/asyncIteratorForEach';
import { iteratorToAsync } from 'iter-fest/iteratorToAsync';

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
