import { iterableFilter } from './iterableFilter';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.filter()', array => {
  let arrayPredicate: jest.Mock<unknown, [number, number, typeof array]>;
  let iterable: Iterable<number>;
  let iterablePredicate: jest.Mock<unknown, [number, number, typeof iterable]>;
  let arrayResult: number[];
  let iterableResult: number[];

  beforeEach(() => {
    const thisArg = {};
    const predicate = (value: number) => value % 2;

    iterable = array.values();

    arrayPredicate = jest.fn();
    iterablePredicate = jest.fn();

    arrayPredicate.mockImplementation(predicate);
    iterablePredicate.mockImplementation(predicate);

    arrayResult = array.filter(arrayPredicate, thisArg);
    iterableResult = Array.from(iterableFilter(iterable, iterablePredicate, thisArg));
  });

  describe('the predicate', () => {
    test('should have called the same number of times', () =>
      expect(iterablePredicate).toHaveBeenCalledTimes(arrayPredicate.mock.calls.length));
    test('should have called with similar arguments', () =>
      expect(iterablePredicate.mock.calls).toEqual(
        arrayPredicate.mock.calls.map(call => [call[0], call[1], expect.anything()])
      ));
    test('should have returned with same value', () =>
      expect(iterablePredicate.mock.results).toEqual(arrayPredicate.mock.results));
    test('should have called with same context', () =>
      expect(iterablePredicate.mock.contexts).toEqual(arrayPredicate.mock.contexts));
  });

  test('should return same result', () => expect(iterableResult).toEqual(arrayResult));
});

test('should throw TypeError when passing an invalid callbackFn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iterableFilter([], 0 as any).next()).toThrow('is not a function'));
