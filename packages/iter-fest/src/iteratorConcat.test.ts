import { expect } from 'expect';
import { beforeEach, test } from 'node:test';
import { iteratorConcat } from './iteratorConcat.ts';
import { describeEach } from './private/describeEach.ts';

describeEach([[[1], [[2, 3], 4]]])(
  'when compare to %s.concat()',
  (array: readonly number[], items: readonly (number | readonly number[])[]) => {
    let arrayResult: number[];
    let iteratorResult: number[];

    beforeEach(() => {
      arrayResult = array.concat(...items);
      iteratorResult = Array.from(
        iteratorConcat(array.values(), ...(items?.map(item => (typeof item === 'number' ? item : item.values())) || []))
      );
    });

    test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
  }
);
