const { expect } = require('expect');
const { iteratorToIterable } = require('iter-fest/iteratorToIterable');
const { Observable } = require('iter-fest/observable');
const { fake } = require('sinon');

describe('iteratorToIterable', () => {
  it('should work', () =>
    expect(
      Array.from(
        iteratorToIterable(
          (() => {
            let value = 0;

            return { next: () => (++value <= 3 ? { done: false, value } : { done: true, value: undefined }) };
          })()
        )
      )
    ).toEqual([1, 2, 3]));

  it('Observable should work', () => {
    const next = fake(() => {});
    const complete = fake(() => {});

    const observable = new Observable(observer => {
      observer.next(1);
      observer.complete();
    });

    observable.subscribe({ complete, next });

    expect(next).toHaveProperty('callCount', 1);
    expect(next.getCall(0)).toHaveProperty('args', [1]);
    expect(complete).toHaveProperty('callCount', 1);
  });
});
