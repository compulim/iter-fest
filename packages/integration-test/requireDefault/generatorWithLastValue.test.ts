/* eslint-disable @typescript-eslint/no-var-requires */
const { generatorWithLastValue } = require('iter-fest');

test('generatorWithLastValue should work', () => {
  const generator = generatorWithLastValue(
    (function* () {
      yield 1;

      return 'end' as const;
    })()
  );

  for (const value of generator) {
    expect(value).toBe(1);
  }

  expect(generator.lastValue()).toEqual('end');
});
