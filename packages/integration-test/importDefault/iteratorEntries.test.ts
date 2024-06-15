import { iteratorEntries } from 'iter-fest';

test('iteratorEntries should work', () =>
  expect(Array.from(iteratorEntries(['A', 'B', 'C'].values()))).toEqual([
    [0, 'A'],
    [1, 'B'],
    [2, 'C']
  ]));
