const { expect } = require('expect');
const { asyncGeneratorWithLastValue } = require('iter-fest');

describe('asyncGeneratorWithLastValue', () => {
  it('should work', async () => {
    const asyncGenerator = asyncGeneratorWithLastValue(
      (async function* () {
        yield 1;

        return 'end';
      })()
    );

    for await (const value of asyncGenerator) {
      expect(value).toBe(1);
    }

    expect(asyncGenerator.lastValue()).toEqual('end');
  });
});
