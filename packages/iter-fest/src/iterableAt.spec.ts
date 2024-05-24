import { iterableAt } from './iterableAt';

describe.each([
  [[1, 2, 3], 0],
  [[1, 2, 3], 1],
  [[1, 2, 3], 4],
  [[1, 2, 3], -Infinity],
  [[1, 2, 3], Infinity],
  [[1, 2, 3], 0.1],
  [[], 0]
])('when compare to %s.at(%s)', (array: number[], index: number) => {
  let iterable: Iterable<number>;
  let arrayResult: number | undefined;
  let iterableResult: number | undefined;

  beforeEach(() => {
    iterable = array.values();

    arrayResult = array.at(index);
    iterableResult = iterableAt(iterable, index);
  });

  test('should return same result', () => expect(iterableResult).toBe(arrayResult));
});
