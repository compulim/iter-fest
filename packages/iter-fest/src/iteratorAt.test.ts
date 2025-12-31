import { expect } from 'expect';
import { beforeEach, test } from 'node:test';
import { iteratorAt } from './iteratorAt.ts';
import { describeEach } from './private/describeEach.ts';

describeEach([
  [[1, 2, 3], 0],
  [[1, 2, 3], 1],
  [[1, 2, 3], 4],
  [[1, 2, 3], -Infinity],
  [[1, 2, 3], Infinity],
  [[1, 2, 3], 0.1],
  [[], 0]
])('when compare to %s.at(%s)', (array: readonly number[], index: number) => {
  let iterator: Iterator<number>;
  let arrayResult: number | undefined;
  let iteratorResult: number | undefined;

  beforeEach(() => {
    iterator = array.values();

    arrayResult = array.at(index);
    iteratorResult = iteratorAt(iterator, index);
  });

  test('should return same result', () => expect(iteratorResult).toBe(arrayResult));
});

test('when passing fromIndex of -1 should throw TypeError', () =>
  expect(() => iteratorAt([].values(), -1)).toThrow('index cannot be a negative finite number'));
