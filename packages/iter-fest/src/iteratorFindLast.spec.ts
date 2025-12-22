import { expect } from 'expect';
import { fn, type Mock } from 'jest-mock';
import { beforeEach, describe, test } from 'node:test';
import { iteratorFindLast } from './iteratorFindLast.ts';
import { describeEach } from './private/describeEach.ts';

describeEach([[[1, 2, 3]], [[]]])('when compare to %s.findLast()', (array: readonly number[]) => {
  let arrayPredicate: Mock<(_1: number, _2: number, _3: readonly number[]) => unknown>;
  let iterator: Iterator<number>;
  let iteratorPredicate: Mock<(_1: number, _2: number, _3: Iterator<number>) => unknown>;
  let arrayResult: number | undefined;
  let iteratorResult: number | undefined;
  let thisArg: object;

  beforeEach(() => {
    const predicate = (value: number) => value % 2;

    thisArg = {};
    iterator = array.values();

    arrayPredicate = fn();
    iteratorPredicate = fn();

    arrayPredicate.mockImplementation(predicate);
    iteratorPredicate.mockImplementation(predicate);

    arrayResult = array.findLast(arrayPredicate, thisArg);
    iteratorResult = iteratorFindLast(iterator, iteratorPredicate, thisArg);
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
  } else {
    test('the predicate should not be called', () => expect(iteratorPredicate).toHaveBeenCalledTimes(0));
  }

  test('should return same result', () => expect(iteratorResult).toBe(arrayResult));
});

test('should throw TypeError when passing an invalid callbackFn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iteratorFindLast([].values(), 0 as any)).toThrow('is not a function'));
