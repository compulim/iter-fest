import withResolvers from 'core-js-pure/full/promise/with-resolvers.js';
import { expect } from 'expect';
import { IterableWritableStream } from 'iter-fest';
import { fake } from 'sinon';

describe('IterableWritableStream', () => {
  it('should work', async () => {
    let deferred = withResolvers();
    const done = fake(() => {});
    const iterable = new IterableWritableStream();
    const writer = iterable.getWriter();
    const values = [];

    (async function () {
      for await (const value of iterable) {
        values.push(value);

        deferred.resolve();
        deferred = withResolvers();
      }

      done();
      deferred.resolve();
    })();

    expect(values).toEqual([]);
    expect(done).toHaveProperty('callCount', 0);

    writer.write(1);
    await deferred.promise;
    expect(values).toEqual([1]);
    expect(done).toHaveProperty('callCount', 0);

    writer.write(2);
    await deferred.promise;
    expect(values).toEqual([1, 2]);
    expect(done).toHaveProperty('callCount', 0);

    writer.close();
    await deferred.promise;
    expect(done).toHaveProperty('callCount', 1);
  });
});
