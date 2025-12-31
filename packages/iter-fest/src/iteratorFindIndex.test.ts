import { expect } from 'expect';
import { fn, type Mock } from 'jest-mock';
import { beforeEach, describe, test } from 'node:test';
import { iteratorFindIndex } from './iteratorFindIndex.ts';
import { describeEach } from './private/describeEach.ts';

describeEach([[[1, 2, 3]], [[]]])('when compare to %s.findIndex()', array => {
  let arrayPredicate: Mock<(_1: number, _2: number, _3: readonly number[]) => unknown>;
  let iterator: Iterator<number>;
  let iteratorPredicate: Mock<(_1: number, _2: number, _3: Iterator<number>) => unknown>;
  let arrayResult: number | undefined;
  let iteratorResult: number | undefined;

  beforeEach(() => {
    const thisArg = {};
    const predicate = (value: number) => value % 2;

    iterator = array.values();

    arrayPredicate = fn();
    iteratorPredicate = fn();

    arrayPredicate.mockImplementation(predicate);
    iteratorPredicate.mockImplementation(predicate);

    arrayResult = array.findIndex(arrayPredicate, thisArg);
    iteratorResult = iteratorFindIndex(iterator, iteratorPredicate, thisArg);
  });

  describe('the predicate', () => {
    test('should have called the same number of times', () =>
      expect(iteratorPredicate).toHaveBeenCalledTimes(arrayPredicate.mock.calls.length));
    test('should have called with similar arguments', () =>
      expect(iteratorPredicate.mock.calls).toEqual(
        arrayPredicate.mock.calls.map(call => [call[0], call[1], expect.anything()])
      ));
    test('should have returned with same value', () =>
      expect(iteratorPredicate.mock.results).toEqual(arrayPredicate.mock.results));
    test('should have called with same context', () =>
      expect(iteratorPredicate.mock.contexts).toEqual(arrayPredicate.mock.contexts));
  });

  test('should return same result', () => expect(iteratorResult).toBe(arrayResult));
});

test('should throw TypeError when passing an invalid callbackFn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iteratorFindIndex([].values(), 0 as any)).toThrow('is not a function'));
