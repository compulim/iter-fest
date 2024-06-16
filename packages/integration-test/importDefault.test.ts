import { SymbolObservable, readerValues } from 'iter-fest';

test('SymbolObservable should work', () => {
  const observable = new Observable(() => {});

  expect(observable[SymbolObservable]()).toBe(observable);
});
