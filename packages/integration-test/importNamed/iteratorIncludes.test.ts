import { iteratorIncludes } from 'iter-fest/iteratorIncludes';

test('iteratorIncludes should work', () => expect(iteratorIncludes([1, 2, 3].values(), 2)).toBe(true));
