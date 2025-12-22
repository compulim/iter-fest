import { expect } from 'expect';
import { fn, type Mock } from 'jest-mock';
import { beforeEach, describe, test } from 'node:test';
import { iteratorReduce } from './iteratorReduce.ts';
import { iteratorTake } from './iteratorTake.ts';
import { describeEach } from './private/describeEach.ts';

describeEach([[[1, 2, 3]], [[]]])('when compare to %s.reduce()', array => {
  let arrayReducer: Mock<(_1: string, _2: number, _3: number, _4: readonly number[]) => string>;
  let iterator: Iterator<number>;
  // Iterator.reduce() do not have third argument of the iterator itself, unlike Array.reduce().
  let iteratorReducer: Mock<(_1: string, _2: number, _3: number) => string>;
  let arrayResult: string;
  let iteratorResult: string;

  beforeEach(() => {
    const reducer = (previousValue: string, value: number) => previousValue + value;

    iterator = array.values();

    arrayReducer = fn();
    iteratorReducer = fn();

    arrayReducer.mockImplementation(reducer);
    iteratorReducer.mockImplementation(reducer);

    arrayResult = array.reduce(arrayReducer, '');
    iteratorResult = iteratorReduce(iterator, iteratorReducer, '');
  });

  describe('the predicate', () => {
    test('should have called the same number of times', () =>
      expect(iteratorReducer).toHaveBeenCalledTimes(arrayReducer.mock.calls.length));
    test('should have called with similar arguments', () =>
      expect(iteratorReducer.mock.calls).toEqual(arrayReducer.mock.calls.map(call => [call[0], call[1], call[2]])));
    test('should have returned with same value', () =>
      expect(iteratorReducer.mock.results).toEqual(arrayReducer.mock.results));
    test('should have called with same context', () =>
      expect(iteratorReducer.mock.contexts).toEqual(arrayReducer.mock.contexts));
  });

  test('should return same result', () => expect(iteratorResult).toBe(arrayResult));
});

test('should throw TypeError when passing an invalid callbackfn', () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => iteratorReduce([].values(), 0 as any)).toThrow('is not a function'));

test('should work with TC39 sample', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  function* naturals() {
    let i = 0;

    while (true) {
      yield i;

      i += 1;
    }
  }

  const result = iteratorReduce(
    iteratorTake(naturals(), 5),
    (sum, value) => {
      return sum + value;
    },
    3
  );

  expect(result).toBe(13);
});
