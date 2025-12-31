import { expect } from 'expect';
import { iteratorKeys } from 'iter-fest/iteratorKeys';
import { describe, it } from 'node:test';

describe('iteratorKeys', () => {
  it('should work', () => expect(Array.from(iteratorKeys(['A', 'B', 'C'].values()))).toEqual([0, 1, 2]));
});
