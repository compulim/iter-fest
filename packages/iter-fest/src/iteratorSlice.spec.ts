import { iteratorSlice } from './iteratorSlice';

describe.each([
  [[1, 2, 3, 4, 5], undefined, 1],
  [[1, 2, 3, 4, 5], 1, undefined],
  [[1, 2, 3, 4, 5], undefined, undefined],
  [[1, 2, 3, 4, 5], 1, 1],
  [[1, 2, 3, 4, 5], 1, 3],
  [[1, 2, 3, 4, 5], 3, 1],
  [[1, 2, 3, 4, 5], 1, 100],
  [[1, 2, 3, 4, 5], 100, 1],
  [[1, 2, 3, 4, 5], -Infinity, Infinity],
  [[], undefined, undefined]
])('when compare to %s.slice(%s, %s)', (array: number[], start: number | undefined, end: number | undefined) => {
  let iterator: Iterator<number>;
  let arrayResult: number[];
  let iteratorResult: number[];

  beforeEach(() => {
    iterator = array.values();

    arrayResult = array.slice(start, end);
    iteratorResult = Array.from(iteratorSlice(iterator, start, end));
  });

  test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
});

describe('when passing start of Infinity', () => {
  let next: jest.Mock<IteratorResult<number>, []>;
  let iterator: IterableIterator<number>;
  let result: number[];

  beforeEach(() => {
    next = jest.fn(() => ({ done: true, value: undefined }));

    iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next
    };

    result = Array.from(iteratorSlice(iterator, Infinity));
  });

  test('should return empty result', () => expect(result).toEqual([]));
  test('should not call next()', () => expect(next).toHaveBeenCalledTimes(0));
});
