import { expect } from 'expect';
import { iteratorAt } from 'iter-fest';

describe('iteratorAt', () => {
  it('should work', () => expect(iteratorAt([1, 2, 3].values(), 1)).toBe(2));
});
