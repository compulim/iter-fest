import { iteratorToSpliced } from './iteratorToSpliced';

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
    let iterator: Iterator<number>;
    let arrayResult: number[];
    let iteratorResult: number[];

    beforeEach(() => {
      iterator = array.values();

      arrayResult = array.toSpliced(start as number, deleteCount as number, ...items);
      iteratorResult = Array.from(iteratorToSpliced(iterator, start, deleteCount, ...items));
    });

    test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
  }
);

test('when passing start of -1 should throw TypeError', () =>
  expect(() => Array.from(iteratorToSpliced([].values(), -1, 0))).toThrow('start cannot be a negative finite number'));
