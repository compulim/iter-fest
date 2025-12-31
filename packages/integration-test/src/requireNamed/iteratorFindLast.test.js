const { expect } = require('expect');
const { iteratorFindLast } = require('iter-fest/iteratorFindLast');
const { describe, it } = require('node:test');

describe('iteratorFindLast', () => {
  it('should work', () => expect(iteratorFindLast([1, 2, 3].values(), value => value % 2)).toBe(3));
});
