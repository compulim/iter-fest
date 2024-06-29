const { expect } = require('expect');
const { asyncIteratorToAsyncIterable } = require('iter-fest/asyncIteratorToAsyncIterable');

describe('asyncIteratorToIterable', () => {
  it('should work', async () => {
    const iterable = asyncIteratorToAsyncIterable(
      (() => {
        let value = 0;

        return {
          next: () => Promise.resolve(++value <= 3 ? { done: false, value } : { done: true, value: undefined })
        };
      })()
    );

    const values = [];

    for await (const value of iterable) {
      values.push(value);
    }

    expect(values).toEqual([1, 2, 3]);
  });
});
