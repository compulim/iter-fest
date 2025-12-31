import { expect } from 'expect';
import { iteratorToString } from 'iter-fest';
import { describe, it } from 'node:test';

describe('iteratorToString', () => {
  it('should work', () => expect(iteratorToString([1, 2, 3].values())).toBe('1,2,3'));
});
