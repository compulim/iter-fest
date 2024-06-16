const { readerValues } = require('iter-fest/readerValues');
const { SymbolObservable } = require('iter-fest/symbolObservable');

test('SymbolObservable should work', () => {
  const observable = new Observable(() => {});

  expect(observable[SymbolObservable]()).toBe(observable);
});
