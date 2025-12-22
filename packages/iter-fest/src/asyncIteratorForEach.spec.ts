import { expect } from 'expect';
import { test } from 'node:test';
import { asyncIteratorForEach } from './asyncIteratorForEach.ts';
import { iteratorToAsync } from './iteratorToAsync.ts';

test('should work with TC39 sample (sync)', async () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  const log: number[] = [];
  const fn = async (value: number) => void log.push(value);
  const iter = iteratorToAsync([1, 2, 3].values());

  await asyncIteratorForEach(iter, fn);

  expect(log.join(', ')).toBe('1, 2, 3');
});
