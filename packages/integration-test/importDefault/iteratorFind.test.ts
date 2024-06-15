import { iteratorFind } from 'iter-fest';

test('iteratorFind should work', () => expect(iteratorFind([1, 2, 3].values(), value => value % 2)).toBe(1));
