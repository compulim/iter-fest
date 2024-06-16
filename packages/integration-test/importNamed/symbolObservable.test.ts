import { Observable } from 'iter-fest/observable';
import { SymbolObservable } from 'iter-fest/symbolObservable';

test('SymbolObservable should work', () => {
  const observable = new Observable(() => {});

  expect(observable[SymbolObservable]()).toBe(observable);
});
