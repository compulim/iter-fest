import iteratorToIterable from './iteratorToIterable';

describe('passing a iterator-compatible generator', () => {
  let iterable: IterableIterator<number>;

  beforeEach(() => {
    iterable = iteratorToIterable(
      (function* () {
        yield 1;
        yield 2;
        yield 3;
      })()
    );
  });

  test('should be iterable', () => expect(Array.from(iterable)).toEqual([1, 2, 3]));
});
