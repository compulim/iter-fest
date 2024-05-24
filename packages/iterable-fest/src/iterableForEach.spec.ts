import { iterableForEach } from './iterableForEach';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.map()', array => {
  let arrayCallbackfn: jest.Mock<void, [number, number, number[]]>;
  let iterable: Iterable<number>;
  let iterableCallbackfn: jest.Mock<void, [number, number, Iterable<number>]>;

  beforeEach(() => {
    const callbackfn = (_: number) => {};
    const thisArg = {};

    iterable = array.values();

    arrayCallbackfn = jest.fn();
    iterableCallbackfn = jest.fn();

    arrayCallbackfn.mockImplementation(callbackfn);
    iterableCallbackfn.mockImplementation(callbackfn);

    array.forEach(arrayCallbackfn, thisArg);
    iterableForEach(iterable, iterableCallbackfn, thisArg);
  });

  describe('the predicate', () => {
    test('should have called the same number of times', () =>
      expect(iterableCallbackfn).toHaveBeenCalledTimes(arrayCallbackfn.mock.calls.length));
    test('should have called with similar arguments', () =>
      expect(iterableCallbackfn.mock.calls).toEqual(
        arrayCallbackfn.mock.calls.map(call => [call[0], call[1], expect.anything()])
      ));
    test('should have returned with same value', () =>
      expect(iterableCallbackfn.mock.results).toEqual(arrayCallbackfn.mock.results));
    test('should have called with same context', () =>
      expect(iterableCallbackfn.mock.contexts).toEqual(arrayCallbackfn.mock.contexts));
  });
});

test('should throw TypeError when passing an invalid callbackfn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iterableForEach([], 0 as any)).toThrow('is not a function'));
