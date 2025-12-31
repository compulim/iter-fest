import { expect } from 'expect';
import { iteratorFindLast } from 'iter-fest/iteratorFindLast';
import { describe, it } from 'node:test';

describe('iteratorFindLast', () => {
  it('should work', () => expect(iteratorFindLast([1, 2, 3].values(), value => value % 2)).toBe(3));
});
