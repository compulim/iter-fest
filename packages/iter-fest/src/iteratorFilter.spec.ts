import { iteratorFilter } from './iteratorFilter';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.filter()', array => {
  let arrayPredicate: jest.Mock<unknown, [number, number, typeof array]>;
  let iterator: Iterator<number>;
  // Iterator.filter() do not have third argument of the iterator itself, unlike Array.filter().
  let iteratorPredicate: jest.Mock<unknown, [number, number]>;
  let arrayResult: number[];
  let iteratorResult: number[];

  beforeEach(() => {
    const predicate = (value: number) => value % 2;

    iterator = array.values();

    arrayPredicate = jest.fn();
    iteratorPredicate = jest.fn();

    arrayPredicate.mockImplementation(predicate);
    iteratorPredicate.mockImplementation(predicate);

    arrayResult = array.filter(arrayPredicate);
    iteratorResult = Array.from(iteratorFilter(iterator, iteratorPredicate));
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

  test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
});

test('should throw TypeError when passing an invalid callbackFn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iteratorFilter([].values(), 0 as any).next()).toThrow('is not a function'));

test('should work with TC39 sample', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  function* naturals() {
    let i = 0;

    while (true) {
      yield i;

      i += 1;
    }
  }

  const result = iteratorFilter(naturals(), value => {
    return value % 2 == 0;
  });

  expect(result.next()).toEqual({ done: false, value: 0 });
  expect(result.next()).toEqual({ done: false, value: 2 });
  expect(result.next()).toEqual({ done: false, value: 4 });
});
