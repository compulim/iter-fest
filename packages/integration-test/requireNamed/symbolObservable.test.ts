/* eslint-disable @typescript-eslint/no-var-requires */
const { Observable } = require('iter-fest/observable');
const { SymbolObservable } = require('iter-fest/symbolObservable');

test('SymbolObservable should work', () => {
  const observable = new Observable(() => {});

  expect(observable[SymbolObservable]()).toBe(observable);
});
