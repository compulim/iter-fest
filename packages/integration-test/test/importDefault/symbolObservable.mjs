import { expect } from 'expect';
import { Observable, SymbolObservable } from 'iter-fest';

describe('SymbolObservable', () => {
  it('should work', () => {
    const observable = new Observable(() => {});

    expect(observable[SymbolObservable]()).toBe(observable);
  });
});
