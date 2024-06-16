/* eslint-disable @typescript-eslint/no-var-requires */
const { asyncGeneratorWithLastValue } = require('iter-fest');

test('asyncGeneratorWithLastValue should work', async () => {
  const asyncGenerator = asyncGeneratorWithLastValue(
    (async function* () {
      yield 1;

      return 'end' as const;
    })()
  );

  for await (const value of asyncGenerator) {
    expect(value).toBe(1);
  }

  expect(asyncGenerator.lastValue()).toEqual('end');
});
