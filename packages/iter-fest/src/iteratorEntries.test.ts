import { expect } from 'expect';
import { beforeEach, test } from 'node:test';
import { iteratorEntries } from './iteratorEntries.ts';
import { describeEach } from './private/describeEach.ts';

describeEach([[['A', 'B', 'C']], [[]]])('when compare to %s.entries()', (array: readonly string[]) => {
  let iterator: Iterator<string>;
  let arrayResult: [number, string][];
  let iteratorResult: [number, string][];

  beforeEach(() => {
    iterator = array.values();

    arrayResult = Array.from(array.entries());
    iteratorResult = Array.from(iteratorEntries(iterator));
  });

  test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
});
