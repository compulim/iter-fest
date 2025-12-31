const { expect } = require('expect');
const { iteratorToString } = require('iter-fest/iteratorToString');
const { describe, it } = require('node:test');

describe('iteratorToString', () => {
  it('should work', () => expect(iteratorToString([1, 2, 3].values())).toBe('1,2,3'));
});
