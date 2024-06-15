import { iteratorJoin } from './iteratorJoin';

describe.each([
  [[1, 2, 3], undefined],
  [[1, 2, 3], ''],
  [[1, 2, 3], ', '],
  [[1, undefined, 2, null, 3], undefined]
])('when compare to %s.join()', (array: (number | null | undefined)[], separator: string | undefined) => {
  let arrayResult: string;
  let iteratorResult: string;

  beforeEach(() => {
    arrayResult = array.join(separator);
    iteratorResult = iteratorJoin(array.values(), separator);
  });

  test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
});
