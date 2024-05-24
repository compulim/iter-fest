import { iterableFindLast } from './iterableFindLast';

describe.each([[[1, 2, 3]], [[]]])('when compare to %s.findLast()', (array: number[]) => {
  let arrayPredicate: jest.Mock<unknown, [number, number, number[]]>;
  let iterable: Iterable<number>;
  let iterablePredicate: jest.Mock<unknown, [number, number, Iterable<number>]>;
  let arrayResult: number | undefined;
  let iterableResult: number | undefined;
  let thisArg: object;

  beforeEach(() => {
    const predicate = (value: number) => value % 2;

    thisArg = {};
    iterable = array.values();

    arrayPredicate = jest.fn();
    iterablePredicate = jest.fn();

    arrayPredicate.mockImplementation(predicate);
    iterablePredicate.mockImplementation(predicate);

    arrayResult = array.findLast(arrayPredicate, thisArg);
    iterableResult = iterableFindLast(iterable, iterablePredicate, thisArg);
  });

  if (array.length === 3) {
    describe('the predicate', () => {
      test('should have called the 3 times', () => expect(iterablePredicate).toHaveBeenCalledTimes(3));
      test('should have called in similar way', () => {
        expect(iterablePredicate).toHaveBeenNthCalledWith(1, 1, 0, iterable);
        expect(iterablePredicate).toHaveNthReturnedWith(1, 1);
        expect(iterablePredicate.mock.contexts[0]).toBe(thisArg);

        expect(iterablePredicate).toHaveBeenNthCalledWith(2, 2, 1, iterable);
        expect(iterablePredicate).toHaveNthReturnedWith(2, 0);
        expect(iterablePredicate.mock.contexts[1]).toBe(thisArg);

        expect(iterablePredicate).toHaveBeenNthCalledWith(3, 3, 2, iterable);
        expect(iterablePredicate).toHaveNthReturnedWith(3, 1);
        expect(iterablePredicate.mock.contexts[2]).toBe(thisArg);
      });
    });
  } else {
    test('the predicate should not be called', () => expect(iterablePredicate).toHaveBeenCalledTimes(0));
  }

  test('should return same result', () => expect(iterableResult).toBe(arrayResult));
});

test('should throw TypeError when passing an invalid callbackFn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iterableFindLast([], 0 as any)).toThrow('is not a function'));
