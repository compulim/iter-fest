import { iteratorIncludes } from './iteratorIncludes';

describe.each([
  [[1, 2, 3], 1, undefined],
  [[1, 2, 3], 1, 1],
  [[1, 2, 3], 1, 0.1],
  [[1, 2, 3], 1, 0.9],
  [[1, 2, 3], 1, 1.1],
  [[1, 2, 3], 1, Infinity],
  [[1, 2, 3], 1, -Infinity],
  [[], 0, undefined]
])('when compare to %s.includes(%s, %s)', (array: number[], searchElement: number, fromIndex: number | undefined) => {
  let iterator: Iterator<number>;
  let arrayResult: boolean;
  let iteratorResult: boolean;

  beforeEach(() => {
    iterator = array.values();

    arrayResult = array.includes(searchElement, fromIndex);
    iteratorResult = iteratorIncludes(iterator, searchElement, fromIndex);
  });

  test('should return same result', () => expect(iteratorResult).toBe(arrayResult));
});

test('when passing fromIndex of -1 should throw TypeError', () =>
  expect(() => iteratorIncludes([].values(), 0, -1)).toThrow('fromIndex cannot be a negative finite number'));

describe('when passing fromIndex of Infinity', () => {
  let next: jest.Mock<IteratorResult<number>, []>;
  let iterator: IterableIterator<number>;
  let result: boolean;

  beforeEach(() => {
    next = jest.fn(() => ({ done: true, value: undefined }));

    iterator = {
      [Symbol.iterator]() {
        return iterator;
      },
      next
    };

    result = iteratorIncludes(iterator, 0, Infinity);
  });

  test('should return false', () => expect(result).toBe(false));
  test('should not call next()', () => expect(next).toHaveBeenCalledTimes(0));
});
