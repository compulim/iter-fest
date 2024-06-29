import { expect } from 'expect';
import { observableFromAsync } from 'iter-fest';
import { fake } from 'sinon';

describe('observableFromAsync', () => {
  it('should work', async () => {
    const observable = observableFromAsync(
      (async function* () {
        yield 1;
        yield 2;
        yield 3;
      })()
    );

    const next = fake(() => {});

    await new Promise(resolve => observable.subscribe({ complete: resolve, next }));

    expect(next).toHaveProperty('callCount', 3);
    expect(next.getCall(0)).toHaveProperty('args', [1]);
    expect(next.getCall(1)).toHaveProperty('args', [2]);
    expect(next.getCall(2)).toHaveProperty('args', [3]);
  });
});
