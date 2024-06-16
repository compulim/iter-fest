/* eslint-disable @typescript-eslint/no-var-requires */
const { Observable } = require('iter-fest/observable');
const { observableValues } = require('iter-fest/observableValues');

test('observableValues should work', async () => {
  const observable = Observable.from([1, 2, 3]);
  const values: number[] = [];

  for await (const value of observableValues(observable)) {
    values.push(value);
  }

  expect(values).toEqual([1, 2, 3]);
});
