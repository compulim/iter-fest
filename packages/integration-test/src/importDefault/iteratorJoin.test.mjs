import { expect } from 'expect';
import { iteratorJoin } from 'iter-fest';
import { describe, it } from 'node:test';

describe('iteratorJoin', () => {
  it('should work', () => expect(iteratorJoin([1, 2, 3].values(), ', ')).toBe('1, 2, 3'));
});
