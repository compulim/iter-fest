const { expect } = require('expect');
const { Observable } = require('iter-fest');
const { fake } = require('sinon');

describe('Observable', () => {
  it('should work', () => {
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
