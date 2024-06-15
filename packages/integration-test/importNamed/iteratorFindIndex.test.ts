import { iteratorFindIndex } from 'iter-fest/iteratorFindIndex';

test('iteratorFindIndex should work', () => expect(iteratorFindIndex([1, 2, 3].values(), value => value % 2)).toBe(0));
