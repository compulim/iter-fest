import { iterableConcat } from './iterableConcat';

describe.each([[[1], [[2, 3], 4]]])('when compare to %s.concat()', (array: number[], items: (number | number[])[]) => {
  let arrayResult: number[];
  let iterableResult: number[];

  beforeEach(() => {
    arrayResult = array.concat(...items);
    iterableResult = Array.from(
      iterableConcat(array.values(), ...(items?.map(item => (typeof item === 'number' ? item : item.values())) || []))
    );
  });

  test('should return same result', () => expect(iterableResult).toEqual(arrayResult));
});
