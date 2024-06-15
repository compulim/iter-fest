import { iteratorToString } from 'iter-fest';

test('iteratorToString should work', () => expect(iteratorToString([1, 2, 3].values())).toBe('1,2,3'));
