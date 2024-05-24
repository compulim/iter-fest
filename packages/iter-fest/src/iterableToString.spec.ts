import { iterableJoin } from './iterableJoin';

describe.each([[[1, 2, 3]], [[1, 2, 3]], [[1, 2, 3]], [[1, undefined, 2, null, 3]]])(
  'when compare to %s.toString()',
  (array: (number | null | undefined)[]) => {
    let arrayResult: string;
    let iterableResult: string;

    beforeEach(() => {
      arrayResult = array.toString();
      iterableResult = iterableJoin(array.values());
    });

    test('should return same result', () => expect(iterableResult).toEqual(arrayResult));
  }
);
