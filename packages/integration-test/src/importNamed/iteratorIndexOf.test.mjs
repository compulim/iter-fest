import { expect } from 'expect';
import { iteratorIndexOf } from 'iter-fest/iteratorIndexOf';
import { describe, it } from 'node:test';

describe('iteratorIndexOf', () => {
  it('should work', () => expect(iteratorIndexOf([1, 2, 3].values(), 2)).toBe(1));
});
