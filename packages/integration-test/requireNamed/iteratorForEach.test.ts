/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorForEach } = require('iter-fest/iteratorForEach');

test('iteratorForEach should work', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  const log: number[] = [];
  const fn = (value: number) => log.push(value);
  const iter = [1, 2, 3].values();

  iteratorForEach(iter, fn);

  expect(log.join(', ')).toBe('1, 2, 3');
});
