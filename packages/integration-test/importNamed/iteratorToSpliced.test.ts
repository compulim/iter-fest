import { iteratorToSpliced } from 'iter-fest/iteratorToSpliced';

test('iteratorToSpliced should work', () =>
  expect(Array.from(iteratorToSpliced([1, 2, 3].values(), 1, 1, 9))).toEqual([1, 9, 3]));
