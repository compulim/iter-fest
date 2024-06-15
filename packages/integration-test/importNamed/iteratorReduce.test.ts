import { iteratorReduce } from 'iter-fest/iteratorReduce';

test('iteratorReduce should work', () =>
  expect(iteratorReduce([1, 2, 3].values(), (previousValue, currentValue) => previousValue + currentValue, 0)).toBe(6));
