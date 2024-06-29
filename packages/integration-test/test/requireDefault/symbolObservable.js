const { expect } = require('expect');
const { Observable, SymbolObservable } = require('iter-fest');

describe('SymbolObservable', () => {
  it('should work', () => {
    const observable = new Observable(() => {});

    expect(observable[SymbolObservable]()).toBe(observable);
  });
});
