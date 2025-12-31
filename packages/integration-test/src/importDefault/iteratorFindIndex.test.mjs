import { expect } from 'expect';
import { iteratorFindIndex } from 'iter-fest';
import { describe, it } from 'node:test';

describe('iteratorFindIndex', () => {
  it('should work', () => expect(iteratorFindIndex([1, 2, 3].values(), value => value % 2)).toBe(0));
});
