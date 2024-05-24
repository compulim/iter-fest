import { iterableEntries } from './iterableEntries';

describe.each([[['A', 'B', 'C']], [[]]])('when compare to %s.entries()', (array: string[]) => {
  let iterable: Iterable<string>;
  let arrayResult: [number, string][];
  let iterableResult: [number, string][];

  beforeEach(() => {
    iterable = array.values();

    arrayResult = Array.from(array.entries());
    iterableResult = Array.from(iterableEntries(iterable));
  });

  test('should return same result', () => expect(iterableResult).toEqual(arrayResult));
});
