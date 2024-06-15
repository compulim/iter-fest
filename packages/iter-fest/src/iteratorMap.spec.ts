import { iteratorMap } from './iteratorMap';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.map()', array => {
  let arrayMapper: jest.Mock<string, [number, number, number[]]>;
  let iterator: Iterator<number>;
  // Iterator.map() do not have third argument of the iterator itself, unlike Array.map().
  let iteratorMapper: jest.Mock<string, [number, number]>;
  let arrayResult: string[];
  let iteratorResult: string[];

  beforeEach(() => {
    const mapper = (value: number) => `"${value}"`;

    iterator = array.values();

    arrayMapper = jest.fn();
    iteratorMapper = jest.fn();

    arrayMapper.mockImplementation(mapper);
    iteratorMapper.mockImplementation(mapper);

    arrayResult = array.map(arrayMapper);
    iteratorResult = Array.from(iteratorMap(iterator, iteratorMapper));
  });

  describe('the predicate', () => {
    test('should have called the same number of times', () =>
      expect(iteratorMapper).toHaveBeenCalledTimes(arrayMapper.mock.calls.length));
    test('should have called with similar arguments', () =>
      expect(iteratorMapper.mock.calls).toEqual(arrayMapper.mock.calls.map(call => [call[0], call[1]])));
    test('should have returned with same value', () =>
      expect(iteratorMapper.mock.results).toEqual(arrayMapper.mock.results));
    test('should have called with same context', () =>
      expect(iteratorMapper.mock.contexts).toEqual(arrayMapper.mock.contexts));
  });

  test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
});

test('should throw TypeError when passing an invalid callbackfn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iteratorMap([].values(), 0 as any).next()).toThrow('is not a function'));

test('should work with TC39 sample', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  function* naturals() {
    let i = 0;

    while (true) {
      yield i;

      i += 1;
    }
  }

  const result = iteratorMap(naturals(), value => {
    return value * value;
  });

  expect(result.next()).toEqual({ done: false, value: 0 });
  expect(result.next()).toEqual({ done: false, value: 1 });
  expect(result.next()).toEqual({ done: false, value: 4 });
});
