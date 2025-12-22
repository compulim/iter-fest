import { expect } from 'expect';
import { beforeEach, test } from 'node:test';
import { iteratorJoin } from './iteratorJoin.ts';
import { describeEach } from './private/describeEach.ts';

describeEach([[[1, 2, 3]], [[1, 2, 3]], [[1, 2, 3]], [[1, undefined, 2, null, 3]]])(
  'when compare to %s.toString()',
  (array: readonly (number | null | undefined)[]) => {
    let arrayResult: string;
    let iteratorResult: string;

    beforeEach(() => {
      arrayResult = array.toString();
      iteratorResult = iteratorJoin(array.values());
    });

    test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
  }
);
