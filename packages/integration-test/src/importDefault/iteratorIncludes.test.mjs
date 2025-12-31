import { expect } from 'expect';
import { iteratorIncludes } from 'iter-fest';
import { describe, it } from 'node:test';

describe('iteratorIncludes', () => {
  it('should work', () => expect(iteratorIncludes([1, 2, 3].values(), 2)).toBe(true));
});
