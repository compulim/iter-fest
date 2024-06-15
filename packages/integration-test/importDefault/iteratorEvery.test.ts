import { iteratorEvery } from 'iter-fest';

test('iteratorEvery should work', () => expect(iteratorEvery([1, 2, 3].values(), value => value)).toBe(true));
