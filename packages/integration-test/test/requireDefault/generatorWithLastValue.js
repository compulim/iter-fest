const { expect } = require('expect');
const { generatorWithLastValue } = require('iter-fest');

describe('generatorWithLastValue', () => {
  it('should work', () => {
    const generator = generatorWithLastValue(
      (function* () {
        yield 1;

        return 'end';
      })()
    );

    for (const value of generator) {
      expect(value).toBe(1);
    }

    expect(generator.lastValue()).toEqual('end');
  });
});
