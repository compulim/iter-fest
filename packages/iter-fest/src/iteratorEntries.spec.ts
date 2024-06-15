import { iteratorEntries } from './iteratorEntries';

describe.each([[['A', 'B', 'C']], [[]]])('when compare to %s.entries()', (array: string[]) => {
  let iterator: Iterator<string>;
  let arrayResult: [number, string][];
  let iteratorResult: [number, string][];

  beforeEach(() => {
    iterator = array.values();

    arrayResult = Array.from(array.entries());
    iteratorResult = Array.from(iteratorEntries(iterator));
  });

  test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
});
