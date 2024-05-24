import { iterableMap } from './iterableMap';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.map()', array => {
  let arrayMapper: jest.Mock<string, [number, number, number[]]>;
  let iterable: Iterable<number>;
  let iterableMapper: jest.Mock<string, [number, number, Iterable<number>]>;
  let arrayResult: string[];
  let iterableResult: string[];

  beforeEach(() => {
    const mapper = (value: number) => `"${value}"`;

    iterable = array.values();

    arrayMapper = jest.fn();
    iterableMapper = jest.fn();

    arrayMapper.mockImplementation(mapper);
    iterableMapper.mockImplementation(mapper);

    arrayResult = array.map(arrayMapper);
    iterableResult = Array.from(iterableMap(iterable, iterableMapper));
  });

  describe('the predicate', () => {
    test('should have called the same number of times', () =>
      expect(iterableMapper).toHaveBeenCalledTimes(arrayMapper.mock.calls.length));
    test('should have called with similar arguments', () =>
      expect(iterableMapper.mock.calls).toEqual(
        arrayMapper.mock.calls.map(call => [call[0], call[1], expect.anything()])
      ));
    test('should have returned with same value', () =>
      expect(iterableMapper.mock.results).toEqual(arrayMapper.mock.results));
    test('should have called with same context', () =>
      expect(iterableMapper.mock.contexts).toEqual(arrayMapper.mock.contexts));
  });

  test('should return same result', () => expect(iterableResult).toEqual(arrayResult));
});

test('should throw TypeError when passing an invalid callbackfn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iterableMap([], 0 as any).next()).toThrow('is not a function'));
