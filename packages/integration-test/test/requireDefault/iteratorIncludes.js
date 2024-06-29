const { expect } = require('expect');
const { iteratorIncludes } = require('iter-fest');

describe('iteratorIncludes', () => {
  it('should work', () => expect(iteratorIncludes([1, 2, 3].values(), 2)).toBe(true));
});
