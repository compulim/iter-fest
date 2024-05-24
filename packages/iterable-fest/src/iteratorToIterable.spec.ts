import { iteratorToIterable } from './iteratorToIterable';

describe('passing a iterator-compatible generator', () => {
  let iterable: IterableIterator<number>;

  beforeEach(() => {
    const iterate = (): Iterator<number> => {
      let value = 0;

      return {
        next: (): IteratorResult<number> => (++value <= 3 ? { done: false, value } : { done: true, value: undefined })
      };
    };

    iterable = iteratorToIterable(iterate());
  });

  test('should be iterable', () => expect(Array.from(iterable)).toEqual([1, 2, 3]));
});
