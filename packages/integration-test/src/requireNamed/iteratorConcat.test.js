const { expect } = require('expect');
const { iteratorConcat } = require('iter-fest/iteratorConcat');
const { describe, it } = require('node:test');

describe('iterableConcat', () => {
  it('should work', () => expect(Array.from(iteratorConcat([1, 2].values(), [3, 4].values()))).toEqual([1, 2, 3, 4]));
});
