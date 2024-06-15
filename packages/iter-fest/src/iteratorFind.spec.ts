import { iteratorFind } from './iteratorFind';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.find()', array => {
  let arrayPredicate: jest.Mock<unknown, [number, number, number[]]>;
  let iterator: Iterator<number>;
  // Iterator.find() do not have third argument of the iterator itself, unlike Array.find().
  let iteratorPredicate: jest.Mock<unknown, [number, number]>;
  let arrayResult: number | undefined;
  let iteratorResult: number | undefined;

  beforeEach(() => {
    const predicate = (value: number) => value % 2;

    iterator = array.values();

    arrayPredicate = jest.fn();
    iteratorPredicate = jest.fn();

    arrayPredicate.mockImplementation(predicate);
    iteratorPredicate.mockImplementation(predicate);

    arrayResult = array.find(arrayPredicate);
    iteratorResult = iteratorFind(iterator, iteratorPredicate);
  });

  describe('the predicate', () => {
    test('should have called the same number of times', () =>
      expect(iteratorPredicate).toHaveBeenCalledTimes(arrayPredicate.mock.calls.length));
    test('should have called with similar arguments', () =>
      expect(iteratorPredicate.mock.calls).toEqual(arrayPredicate.mock.calls.map(call => [call[0], call[1]])));
    test('should have returned with same value', () =>
      expect(iteratorPredicate.mock.results).toEqual(arrayPredicate.mock.results));
    test('should have called with same context', () =>
      expect(iteratorPredicate.mock.contexts).toEqual(arrayPredicate.mock.contexts));
  });

  test('should return same result', () => expect(iteratorResult).toBe(arrayResult));
});

test('should throw TypeError when passing an invalid callbackFn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iteratorFind([].values(), 0 as any)).toThrow('is not a function'));

test('should work with TC39 sample', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  function* naturals() {
    let i = 0;

    while (true) {
      yield i;

      i += 1;
    }
  }

  expect(iteratorFind(naturals(), v => v > 1)).toBe(2);
});
