const { expect } = require('expect');
const { iteratorFindLastIndex } = require('iter-fest/iteratorFindLastIndex');

describe('iteratorFindLastIndex', () => {
  it('should work', () => expect(iteratorFindLastIndex([1, 2, 3].values(), value => value % 2)).toBe(2));
});
