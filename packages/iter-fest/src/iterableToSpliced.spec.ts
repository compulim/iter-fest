import { iterableToSpliced } from './iterableToSpliced';

describe.each([
  [[1, 2, 3, 4, 5], undefined, 1, [9]],
  [[1, 2, 3, 4, 5], 1, undefined, [9]],
  [[1, 2, 3, 4, 5], undefined, undefined, [9]],
  [[1, 2, 3, 4, 5], 1, 1, [9]],
  [[1, 2, 3, 4, 5], 1, 3, [9]],
  [[1, 2, 3, 4, 5], 1, -1, [9]],
  [[1, 2, 3, 4, 5], 1, 100, [9]],
  [[1, 2, 3, 4, 5], 100, 1, [9]],
  [[1, 2, 3, 4, 5], 1, Infinity, [9]],
  [[1, 2, 3, 4, 5], Infinity, 1, [9]],
  [[1, 2, 3, 4, 5], -Infinity, Infinity, [9]],
  [[], undefined, undefined, [9]]
])(
  'when compare to %s.slice(%s, %s, ...%s)',
  (array: number[], start: number | undefined, deleteCount: number | undefined, items: number[]) => {
    let iterable: Iterable<number>;
    let arrayResult: number[];
    let iterableResult: number[];

    beforeEach(() => {
      iterable = array.values();

      arrayResult = array.toSpliced(start as number, deleteCount as number, ...items);
      iterableResult = Array.from(iterableToSpliced(iterable, start, deleteCount, ...items));
    });

    test('should return same result', () => expect(iterableResult).toEqual(arrayResult));
  }
);

test('when passing start of -1 should throw TypeError', () =>
  expect(() => Array.from(iterableToSpliced([], -1, 0))).toThrow('start cannot be a negative finite number'));
