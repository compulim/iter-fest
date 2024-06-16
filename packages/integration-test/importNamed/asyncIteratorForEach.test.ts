import { asyncIteratorForEach } from 'iter-fest/asyncIteratorForEach';
import { iteratorToAsync } from 'iter-fest/iteratorToAsync';

test('asyncIteratorForEach should work', async () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  const log: number[] = [];
  const fn = async (value: number) => void log.push(value);
  const iter = iteratorToAsync([1, 2, 3].values());

  await asyncIteratorForEach(iter, fn);

  expect(log.join(', ')).toBe('1, 2, 3');
});
