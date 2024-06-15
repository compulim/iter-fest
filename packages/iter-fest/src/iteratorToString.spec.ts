import { iteratorJoin } from './iteratorJoin';

describe.each([[[1, 2, 3]], [[1, 2, 3]], [[1, 2, 3]], [[1, undefined, 2, null, 3]]])(
  'when compare to %s.toString()',
  (array: (number | null | undefined)[]) => {
    let arrayResult: string;
    let iteratorResult: string;

    beforeEach(() => {
      arrayResult = array.toString();
      iteratorResult = iteratorJoin(array.values());
    });

    test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
  }
);
