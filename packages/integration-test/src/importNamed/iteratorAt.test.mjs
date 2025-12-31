import { expect } from 'expect';
import { iteratorAt } from 'iter-fest/iteratorAt';
import { describe, it } from 'node:test';

describe('iteratorAt', () => {
  it('should work', () => expect(iteratorAt([1, 2, 3].values(), 1)).toBe(2));
});
