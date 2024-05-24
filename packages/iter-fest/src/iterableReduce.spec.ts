import { iterableReduce } from './iterableReduce';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.reduce()', array => {
  let arrayReducer: jest.Mock<string, [string, number, number, number[]]>;
  let iterable: Iterable<number>;
  let iterableReducer: jest.Mock<string, [string, number, number, Iterable<number>]>;
  let arrayResult: string;
  let iterableResult: string;

  beforeEach(() => {
    const reducer = (previousValue: string, value: number) => previousValue + value;

    iterable = array.values();

    arrayReducer = jest.fn();
    iterableReducer = jest.fn();

    arrayReducer.mockImplementation(reducer);
    iterableReducer.mockImplementation(reducer);

    arrayResult = array.reduce(arrayReducer, '');
    iterableResult = iterableReduce(iterable, iterableReducer, '');
  });

  describe('the predicate', () => {
    test('should have called the same number of times', () =>
      expect(iterableReducer).toHaveBeenCalledTimes(arrayReducer.mock.calls.length));
    test('should have called with similar arguments', () =>
      expect(iterableReducer.mock.calls).toEqual(
        arrayReducer.mock.calls.map(call => [call[0], call[1], call[2], expect.anything()])
      ));
    test('should have returned with same value', () =>
      expect(iterableReducer.mock.results).toEqual(arrayReducer.mock.results));
    test('should have called with same context', () =>
      expect(iterableReducer.mock.contexts).toEqual(arrayReducer.mock.contexts));
  });

  test('should return same result', () => expect(iterableResult).toBe(arrayResult));
});

test('should throw TypeError when passing an invalid callbackfn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iterableReduce([], 0 as any)).toThrow('is not a function'));
