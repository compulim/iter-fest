import { expect } from 'expect';
import { iteratorToAsync } from 'iter-fest/iteratorToAsync';

describe('iteratorToAsync', () => {
  it('should work', async () => {
    const iterator = [1, 2, 3].values();
    const asyncIterator = iteratorToAsync(iterator);

    await expect(asyncIterator.next()).resolves.toEqual({ done: false, value: 1 });
    await expect(asyncIterator.next()).resolves.toEqual({ done: false, value: 2 });
    await expect(asyncIterator.next()).resolves.toEqual({ done: false, value: 3 });
    await expect(asyncIterator.next()).resolves.toEqual({ done: true, value: undefined });
  });
});
