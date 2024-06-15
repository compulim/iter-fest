import { iteratorSome } from './iteratorSome';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.some()', array => {
  let arrayPredicate: jest.Mock<unknown, [number, number, number[]]>;
  let iterator: Iterator<number>;
  // Iterator.some() do not have third argument of the iterator itself, unlike Array.some().
  let iteratorPredicate: jest.Mock<unknown, [number, number]>;
  let arrayResult: boolean;
  let iteratorResult: boolean;

  beforeEach(() => {
    const predicate = (value: number) => value % 2;

    iterator = array.values();

    arrayPredicate = jest.fn();
    iteratorPredicate = jest.fn();

    arrayPredicate.mockImplementation(predicate);
    iteratorPredicate.mockImplementation(predicate);

    arrayResult = array.some(arrayPredicate);
    iteratorResult = iteratorSome(iterator, iteratorPredicate);
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

test('should throw TypeError when passing an invalid predicate', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iteratorSome([].values(), 0 as any)).toThrow('is not a function'));
