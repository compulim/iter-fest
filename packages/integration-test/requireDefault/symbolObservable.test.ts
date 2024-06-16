/* eslint-disable @typescript-eslint/no-var-requires */
const { Observable, SymbolObservable } = require('iter-fest');

test('SymbolObservable should work', () => {
  const observable = new Observable(() => {});

  expect(observable[SymbolObservable]()).toBe(observable);
});
