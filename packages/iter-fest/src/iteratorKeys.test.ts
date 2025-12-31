import { expect } from 'expect';
import { beforeEach, test } from 'node:test';
import { iteratorKeys } from './iteratorKeys.ts';
import { describeEach } from './private/describeEach.ts';

describeEach([[['A', 'B', 'C']], [[]]])('when compare to %s.entries()', (array: readonly string[]) => {
  let iterator: Iterator<string>;
  let arrayResult: number[];
  let iteratorResult: number[];

  beforeEach(() => {
    iterator = array.values();

    arrayResult = Array.from(array.keys());
    iteratorResult = Array.from(iteratorKeys(iterator));
  });

  test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
});
