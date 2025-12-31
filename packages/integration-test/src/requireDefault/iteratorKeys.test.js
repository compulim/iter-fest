const { expect } = require('expect');
const { iteratorKeys } = require('iter-fest');
const { describe, it } = require('node:test');

describe('iteratorKeys', () => {
  it('should work', () => expect(Array.from(iteratorKeys(['A', 'B', 'C'].values()))).toEqual([0, 1, 2]));
});
