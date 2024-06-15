import { iteratorJoin } from 'iter-fest';

test('iteratorJoin should work', () => expect(iteratorJoin([1, 2, 3].values(), ', ')).toBe('1, 2, 3'));
