import { asyncIteratorToAsyncIterable } from './asyncIteratorToAsyncIterable';

describe('passing an async iterator-compatible generator', () => {
  let asyncIterable: AsyncIterableIterator<number>;

  beforeEach(() => {
    const iterate = (): AsyncIterator<number> => {
      let value = 0;

      return {
        next: (): Promise<IteratorResult<number>> =>
          Promise.resolve(++value <= 3 ? { done: false, value } : { done: true, value: undefined })
      };
    };

    asyncIterable = asyncIteratorToAsyncIterable(iterate());
  });

  test('should be iterable', async () => {
    const values: number[] = [];

    for await (const value of asyncIterable) {
      values.push(value);
    }

    expect(values).toEqual([1, 2, 3]);
  });
});
