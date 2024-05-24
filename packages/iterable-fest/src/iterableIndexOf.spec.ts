import { iterableIndexOf } from './iterableIndexOf';

describe.each([
  [[1, 2, 3], 1, undefined],
  [[1, 2, 3], 1, 1],
  [[1, 2, 3], 1, 0.1],
  [[1, 2, 3], 1, 0.9],
  [[1, 2, 3], 1, 1.1],
  [[1, 2, 3], 1, Infinity],
  [[1, 2, 3], 1, -Infinity],
  [[], 0, undefined]
])('when compare to %s.indexOf(%s, %s)', (array: number[], searchElement: number, fromIndex: number | undefined) => {
  let iterable: Iterable<number>;
  let arrayResult: number;
  let iterableResult: number;

  beforeEach(() => {
    iterable = array.values();

    arrayResult = array.indexOf(searchElement, fromIndex);
    iterableResult = iterableIndexOf(iterable, searchElement, fromIndex);
  });

  test('should return same result', () => expect(iterableResult).toBe(arrayResult));
});

test('when passing fromIndex of -1 should throw TypeError', () =>
  expect(() => iterableIndexOf([], 0, -1)).toThrow('fromIndex cannot be a negative finite number'));

describe('when passing fromIndex of Infinity', () => {
  let next: jest.Mock<IteratorResult<number>, []>;
  let iterable: IterableIterator<number>;
  let result: number;

  beforeEach(() => {
    next = jest.fn(() => ({ done: true, value: undefined }));

    iterable = {
      [Symbol.iterator]() {
        return iterable;
      },
      next
    };

    result = iterableIndexOf(iterable, 0, Infinity);
  });

  test('should return -1', () => expect(result).toBe(-1));
  test('should not call next()', () => expect(next).toHaveBeenCalledTimes(0));
});
