import { expect } from 'expect';
import { fn, type Mock } from 'jest-mock';
import { beforeEach, describe, test } from 'node:test';
import { iteratorSome } from './iteratorSome.ts';
import { iteratorTake } from './iteratorTake.ts';
import { describeEach } from './private/describeEach.ts';

describeEach([[[1, 2, 3]], [[]]])('when compare to %s.some()', array => {
  let arrayPredicate: Mock<(_1: number, _2: number, _3: readonly number[]) => unknown>;
  let iterator: Iterator<number>;
  // Iterator.some() do not have third argument of the iterator itself, unlike Array.some().
  let iteratorPredicate: Mock<(_1: number, _2: number) => unknown>;
  let arrayResult: boolean;
  let iteratorResult: boolean;

  beforeEach(() => {
    const predicate = (value: number) => value % 2;

    iterator = array.values();

    arrayPredicate = fn();
    iteratorPredicate = fn();

    arrayPredicate.mockImplementation(predicate);
    iteratorPredicate.mockImplementation(predicate);

    arrayResult = array.some(arrayPredicate);
    iteratorResult = iteratorSome(iterator, iteratorPredicate);
  });

  describe('the predicate', () => {
    test('should have called the same number of times', () =>
      expect(iteratorPredicate).toHaveBeenCalledTimes(arrayPredicate.mock.calls.length));
    test('should have called with similar arguments', () =>
      expect(iteratorPredicate.mock.calls).toEqual(arrayPredicate.mock.calls.map(call => [call[0], call[1]])));
    test('should have returned with same value', () =>
      expect(iteratorPredicate.mock.results).toEqual(arrayPredicate.mock.results));
    test('should have called with same context', () =>
      expect(iteratorPredicate.mock.contexts).toEqual(arrayPredicate.mock.contexts));
  });

  test('should return same result', () => expect(iteratorResult).toBe(arrayResult));
});

test('should throw TypeError when passing an invalid predicate', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iteratorSome([].values(), 0 as any)).toThrow('is not a function'));

test('should work with TC39 sample', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  function* naturals() {
    let i = 0;

    while (true) {
      yield i;

      i += 1;
    }
  }

  const iter = iteratorTake(naturals(), 4);

  expect(iteratorSome(iter, v => v > 1)).toEqual(true);
  expect(iteratorSome(iter, () => true)).toEqual(false); // iterator is already consumed.

  expect(iteratorSome(iteratorTake(naturals(), 4), v => v > 1)).toEqual(true);
  expect(iteratorSome(iteratorTake(naturals(), 4), v => v == 1)).toEqual(true); // acting on a new iterator
});
