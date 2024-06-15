/* eslint-disable @typescript-eslint/no-var-requires */
const { iteratorFlatMap } = require('iter-fest');

test('iteratorFlatMap should work', () => {
  // Copied from https://github.com/tc39/proposal-iterator-helpers.
  const sunny = ["It's Sunny in", '', 'California'].values();

  const result = iteratorFlatMap(sunny, value => value.split(' ').values());

  expect(result.next()).toEqual({ done: false, value: "It's" });
  expect(result.next()).toEqual({ done: false, value: 'Sunny' });
  expect(result.next()).toEqual({ done: false, value: 'in' });
  expect(result.next()).toEqual({ done: false, value: '' });
  expect(result.next()).toEqual({ done: false, value: 'California' });
  expect(result.next()).toEqual({ done: true, value: undefined });
});
