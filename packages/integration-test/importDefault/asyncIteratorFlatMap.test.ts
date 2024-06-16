import { asyncIteratorFlatMap, iteratorToAsync } from 'iter-fest';

test('should follow TC39 proposal sample (sync)', async () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  const sunny = iteratorToAsync(["It's Sunny in", '', 'California'].values());

  const result = asyncIteratorFlatMap(sunny, value => Promise.resolve(value.split(' ').values()));

  await expect(result.next()).resolves.toEqual({ done: false, value: "It's" });
  await expect(result.next()).resolves.toEqual({ done: false, value: 'Sunny' });
  await expect(result.next()).resolves.toEqual({ done: false, value: 'in' });
  await expect(result.next()).resolves.toEqual({ done: false, value: '' });
  await expect(result.next()).resolves.toEqual({ done: false, value: 'California' });
  await expect(result.next()).resolves.toEqual({ done: true, value: undefined });
});
