import { expect } from 'expect';
import { generatorWithLastValue } from 'iter-fest/generatorWithLastValue';

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
