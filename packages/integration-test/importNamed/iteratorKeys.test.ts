import { iteratorKeys } from 'iter-fest/iteratorKeys';

test('iteratorKeys should work', () => expect(Array.from(iteratorKeys(['A', 'B', 'C'].values()))).toEqual([0, 1, 2]));