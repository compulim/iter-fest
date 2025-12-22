import { expect } from 'expect';
import { test } from 'node:test';
import { asyncIteratorFrom } from './asyncIteratorFrom.ts';

test('should follow TC39 proposal sample (sync)', async () => {
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
