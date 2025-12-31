const { expect } = require('expect');
const { iteratorFindIndex } = require('iter-fest/iteratorFindIndex');
const { describe, it } = require('node:test');

describe('iteratorFindIndex', () => {
  it('should work', () => expect(iteratorFindIndex([1, 2, 3].values(), value => value % 2)).toBe(0));
});
