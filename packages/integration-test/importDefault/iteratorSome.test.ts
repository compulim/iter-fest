import { iteratorSome } from 'iter-fest';

test('iteratorSome should work', () => expect(iteratorSome([1, 2, 3].values(), value => value % 2)).toBe(true));
