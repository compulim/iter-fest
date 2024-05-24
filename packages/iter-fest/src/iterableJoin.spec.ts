import { iterableJoin } from './iterableJoin';

describe.each([
  [[1, 2, 3], undefined],
  [[1, 2, 3], ''],
  [[1, 2, 3], ', '],
  [[1, undefined, 2, null, 3], undefined]
])('when compare to %s.join()', (array: (number | null | undefined)[], separator: string | undefined) => {
  let arrayResult: string;
  let iterableResult: string;

  beforeEach(() => {
    arrayResult = array.join(separator);
    iterableResult = iterableJoin(array.values(), separator);
  });

  test('should return same result', () => expect(iterableResult).toEqual(arrayResult));
});
