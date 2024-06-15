import { iteratorReduce } from './iteratorReduce';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.reduce()', array => {
  let arrayReducer: jest.Mock<string, [string, number, number, number[]]>;
  let iterator: Iterator<number>;
  // Iterator.reduce() do not have third argument of the iterator itself, unlike Array.reduce().
  let iteratorReducer: jest.Mock<string, [string, number, number]>;
  let arrayResult: string;
  let iteratorResult: string;

  beforeEach(() => {
    const reducer = (previousValue: string, value: number) => previousValue + value;

    iterator = array.values();

    arrayReducer = jest.fn();
    iteratorReducer = jest.fn();

    arrayReducer.mockImplementation(reducer);
    iteratorReducer.mockImplementation(reducer);

    arrayResult = array.reduce(arrayReducer, '');
    iteratorResult = iteratorReduce(iterator, iteratorReducer, '');
  });

  describe('the predicate', () => {
    test('should have called the same number of times', () =>
      expect(iteratorReducer).toHaveBeenCalledTimes(arrayReducer.mock.calls.length));
    test('should have called with similar arguments', () =>
      expect(iteratorReducer.mock.calls).toEqual(arrayReducer.mock.calls.map(call => [call[0], call[1], call[2]])));
    test('should have returned with same value', () =>
      expect(iteratorReducer.mock.results).toEqual(arrayReducer.mock.results));
    test('should have called with same context', () =>
      expect(iteratorReducer.mock.contexts).toEqual(arrayReducer.mock.contexts));
  });

  test('should return same result', () => expect(iteratorResult).toBe(arrayResult));
});

test('should throw TypeError when passing an invalid callbackfn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iteratorReduce([].values(), 0 as any)).toThrow('is not a function'));
