import { iteratorForEach } from './iteratorForEach';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.map()', array => {
  let arrayCallbackfn: jest.Mock<void, [number, number, number[]]>;
  let iterator: Iterator<number>;
  // Iterator.forEach() do not have third argument of the iterator itself, unlike Array.forEach().
  let iteratorCallbackfn: jest.Mock<void, [number, number]>;

  beforeEach(() => {
    const callbackfn = (_: number) => {};

    iterator = array.values();

    arrayCallbackfn = jest.fn();
    iteratorCallbackfn = jest.fn();

    arrayCallbackfn.mockImplementation(callbackfn);
    iteratorCallbackfn.mockImplementation(callbackfn);

    array.forEach(arrayCallbackfn);
    iteratorForEach(iterator, iteratorCallbackfn);
  });

  describe('the predicate', () => {
    test('should have called the same number of times', () =>
      expect(iteratorCallbackfn).toHaveBeenCalledTimes(arrayCallbackfn.mock.calls.length));
    test('should have called with similar arguments', () =>
      expect(iteratorCallbackfn.mock.calls).toEqual(arrayCallbackfn.mock.calls.map(call => [call[0], call[1]])));
    test('should have returned with same value', () =>
      expect(iteratorCallbackfn.mock.results).toEqual(arrayCallbackfn.mock.results));
    test('should have called with same context', () =>
      expect(iteratorCallbackfn.mock.contexts).toEqual(arrayCallbackfn.mock.contexts));
  });
});

test('should throw TypeError when passing an invalid callbackfn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iteratorForEach([].values(), 0 as any)).toThrow('is not a function'));

test('should work with TC39 sample', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  const log: number[] = [];
  const fn = (value: number) => log.push(value);
  const iter = [1, 2, 3].values();

  iteratorForEach(iter, fn);

  expect(log.join(', ')).toBe('1, 2, 3');
});
