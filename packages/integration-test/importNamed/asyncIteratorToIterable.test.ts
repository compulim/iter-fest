import { asyncIteratorToAsyncIterable } from 'iter-fest/asyncIteratorToAsyncIterable';

test('asyncIteratorToIterable should work', async () => {
  const iterable = asyncIteratorToAsyncIterable(
    ((): AsyncIterator<number> => {
      let value = 0;

      return {
        next: () => Promise.resolve(++value <= 3 ? { done: false, value } : { done: true, value: undefined })
      };
    })()
  );

  const values: number[] = [];

  for await (const value of iterable) {
    values.push(value);
  }

  expect(values).toEqual([1, 2, 3]);
});
