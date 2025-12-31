import { expect } from 'expect';
import { Observable } from 'iter-fest/observable';
import { SymbolObservable } from 'iter-fest/symbolObservable';
import { describe, it } from 'node:test';

describe('SymbolObservable', () => {
  it('should work', () => {
    const observable = new Observable(() => {});

    expect(observable[SymbolObservable]()).toBe(observable);
  });
});
