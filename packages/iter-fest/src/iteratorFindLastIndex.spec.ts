import { iteratorFindLastIndex } from './iteratorFindLastIndex';

describe.each([[[1, 2, 3]], [[2]], [[]]])('when compare to %s.findLastIndex()', (array: number[]) => {
  let arrayPredicate: jest.Mock<unknown, [number, number, number[]]>;
  let iterator: Iterator<number>;
  let iteratorPredicate: jest.Mock<unknown, [number, number, Iterator<number>]>;
  let arrayResult: number | undefined;
  let iteratorResult: number | undefined;
  let thisArg: object;

  beforeEach(() => {
    const predicate = (value: number) => value % 2;

    thisArg = {};
    iterator = array.values();

    arrayPredicate = jest.fn();
    iteratorPredicate = jest.fn();

    arrayPredicate.mockImplementation(predicate);
    iteratorPredicate.mockImplementation(predicate);

    arrayResult = array.findLastIndex(arrayPredicate, thisArg);
    iteratorResult = iteratorFindLastIndex(iterator, iteratorPredicate, thisArg);
  });

  if (array.length === 3) {
    describe('the predicate', () => {
      test('should have called the 3 times', () => expect(iteratorPredicate).toHaveBeenCalledTimes(3));
      test('should have called in similar way', () => {
        expect(iteratorPredicate).toHaveBeenNthCalledWith(1, 1, 0, iterator);
        expect(iteratorPredicate).toHaveNthReturnedWith(1, 1);
        expect(iteratorPredicate.mock.contexts[0]).toBe(thisArg);

        expect(iteratorPredicate).toHaveBeenNthCalledWith(2, 2, 1, iterator);
        expect(iteratorPredicate).toHaveNthReturnedWith(2, 0);
        expect(iteratorPredicate.mock.contexts[1]).toBe(thisArg);

        expect(iteratorPredicate).toHaveBeenNthCalledWith(3, 3, 2, iterator);
        expect(iteratorPredicate).toHaveNthReturnedWith(3, 1);
        expect(iteratorPredicate.mock.contexts[2]).toBe(thisArg);
      });
    });
  } else if (array.length === 1) {
    describe('the predicate', () => {
      test('should have called the 1 times', () => expect(iteratorPredicate).toHaveBeenCalledTimes(1));
      test('should have called in similar way', () => {
        expect(iteratorPredicate).toHaveBeenNthCalledWith(1, 2, 0, iterator);
        expect(iteratorPredicate).toHaveNthReturnedWith(1, 0);
        expect(iteratorPredicate.mock.contexts[0]).toBe(thisArg);
      });
    });
  } else {
    test('the predicate should not be called', () => expect(iteratorPredicate).toHaveBeenCalledTimes(0));
  }

  test('should return same result', () => expect(iteratorResult).toBe(arrayResult));
});

test('should throw TypeError when passing an invalid callbackFn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iteratorFindLastIndex([].values(), 0 as any)).toThrow('is not a function'));
