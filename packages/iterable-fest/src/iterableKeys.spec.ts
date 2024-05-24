import { iterableKeys } from './iterableKeys';

describe.each([[['A', 'B', 'C']], [[]]])('when compare to %s.entries()', (array: string[]) => {
  let iterable: Iterable<string>;
  let arrayResult: number[];
  let iterableResult: number[];

  beforeEach(() => {
    iterable = array.values();

    arrayResult = Array.from(array.keys());
    iterableResult = Array.from(iterableKeys(iterable));
  });

  test('should return same result', () => expect(iterableResult).toEqual(arrayResult));
});
