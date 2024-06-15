import { iteratorConcat } from './iteratorConcat';

describe.each([[[1], [[2, 3], 4]]])('when compare to %s.concat()', (array: number[], items: (number | number[])[]) => {
  let arrayResult: number[];
  let iteratorResult: number[];

  beforeEach(() => {
    arrayResult = array.concat(...items);
    iteratorResult = Array.from(
      iteratorConcat(array.values(), ...(items?.map(item => (typeof item === 'number' ? item : item.values())) || []))
    );
  });

  test('should return same result', () => expect(iteratorResult).toEqual(arrayResult));
});
