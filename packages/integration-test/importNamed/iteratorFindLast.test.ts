import { iteratorFindLast } from 'iter-fest/iteratorFindLast';

test('iteratorFindLast should work', () => expect(iteratorFindLast([1, 2, 3].values(), value => value % 2)).toBe(3));
