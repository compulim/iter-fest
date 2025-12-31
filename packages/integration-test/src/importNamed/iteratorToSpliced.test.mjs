import { expect } from 'expect';
import { iteratorToSpliced } from 'iter-fest/iteratorToSpliced';
import { describe, it } from 'node:test';

describe('iteratorToSpliced', () => {
  it('should work', () => expect(Array.from(iteratorToSpliced([1, 2, 3].values(), 1, 1, 9))).toEqual([1, 9, 3]));
});
