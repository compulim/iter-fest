import { iterableSome } from './iterableSome';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.some()', array => {
  let arrayPredicate: jest.Mock<unknown, [number, number, number[]]>;
  let iterable: Iterable<number>;
  let iterablePredicate: jest.Mock<unknown, [number, number, Iterable<number>]>;
  let arrayResult: boolean;
  let iterableResult: boolean;

  beforeEach(() => {
    const thisArg = {};
    const predicate = (value: number) => value % 2;

    iterable = array.values();

    arrayPredicate = jest.fn();
    iterablePredicate = jest.fn();

    arrayPredicate.mockImplementation(predicate);
    iterablePredicate.mockImplementation(predicate);

    arrayResult = array.some(arrayPredicate, thisArg);
    iterableResult = iterableSome(iterable, iterablePredicate, thisArg);
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

  test('should return same result', () => expect(iterableResult).toBe(arrayResult));
});

test('should throw TypeError when passing an invalid predicate', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iterableSome([], 0 as any)).toThrow('is not a function'));
