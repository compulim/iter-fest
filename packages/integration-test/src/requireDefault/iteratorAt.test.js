const { expect } = require('expect');
const { iteratorAt } = require('iter-fest');
const { describe, it } = require('node:test');

describe('iteratorAt', () => {
  it('should work', () => expect(iteratorAt([1, 2, 3].values(), 1)).toBe(2));
});
