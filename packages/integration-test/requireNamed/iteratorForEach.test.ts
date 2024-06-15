/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorForEach } = require('iter-fest/iteratorForEach');

test('iteratorForEach should work', () => {
  const callbackfn = jest.fn();

  iteratorForEach([1, 2, 3].values(), callbackfn);

  expect(callbackfn).toHaveBeenCalledTimes(3);
});
