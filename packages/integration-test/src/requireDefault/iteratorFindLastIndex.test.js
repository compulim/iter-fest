const { expect } = require('expect');
const { iteratorFindLastIndex } = require('iter-fest');
const { describe, it } = require('node:test');

describe('iteratorFindLastIndex', () => {
  it('should work', () => expect(iteratorFindLastIndex([1, 2, 3].values(), value => value % 2)).toBe(2));
});
