const { expect } = require('expect');
const { Observable } = require('iter-fest/observable');
const { SymbolObservable } = require('iter-fest/symbolObservable');

describe('SymbolObservable', () => {
  it('should work', () => {
    const observable = new Observable(() => {});

    expect(observable[SymbolObservable]()).toBe(observable);
  });
});
