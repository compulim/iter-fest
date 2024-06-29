const { expect } = require('expect');
const { iteratorIndexOf } = require('iter-fest');

describe('iteratorIndexOf', () => {
  it('should work', () => expect(iteratorIndexOf([1, 2, 3].values(), 2)).toBe(1));
});
