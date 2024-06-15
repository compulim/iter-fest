import { iteratorIncludes } from 'iter-fest';

test('iteratorIncludes should work', () => expect(iteratorIncludes([1, 2, 3].values(), 2)).toBe(true));
