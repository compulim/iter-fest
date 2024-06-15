import { iteratorFilter } from 'iter-fest/iteratorFilter';

test('iteratorFilter should work', () =>
  expect(Array.from(iteratorFilter([1, 2, 3].values(), value => value % 2))).toEqual([1, 3]));
