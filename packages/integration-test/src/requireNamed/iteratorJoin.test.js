const { expect } = require('expect');
const { iteratorJoin } = require('iter-fest/iteratorJoin');
const { describe, it } = require('node:test');

describe('iteratorJoin', () => {
  it('should work', () => expect(iteratorJoin([1, 2, 3].values(), ', ')).toBe('1, 2, 3'));
});
