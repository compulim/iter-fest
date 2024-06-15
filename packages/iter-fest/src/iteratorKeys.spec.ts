import { iteratorKeys } from './iteratorKeys';

describe.each([[['A', 'B', 'C']], [[]]])('when compare to %s.entries()', (array: string[]) => {
  let iterator: Iterator<string>;
  let arrayResult: number[];
  let iteratorResult: number[];

  beforeEach(() => {
    iterator = array.values();

    arrayResult = Array.from(array.keys());
    iteratorResult = Array.from(iteratorKeys(iterator));
  });

  test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
});
