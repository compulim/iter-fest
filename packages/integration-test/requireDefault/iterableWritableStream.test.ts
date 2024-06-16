/* eslint-disable @typescript-eslint/no-var-requires */
const withResolvers = require('core-js-pure/full/promise/with-resolvers');
const { IterableWritableStream } = require('iter-fest');

test('IterableWritableStream should work', async () => {
  let deferred = withResolvers();
  const done = jest.fn();
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
  expect(done).not.toHaveBeenCalled();

  writer.write(1);
  await deferred.promise;
  expect(values).toEqual([1]);
  expect(done).not.toHaveBeenCalled();

  writer.write(2);
  await deferred.promise;
  expect(values).toEqual([1, 2]);
  expect(done).not.toHaveBeenCalled();

  writer.close();
  await deferred.promise;
  expect(done).toHaveBeenCalledTimes(1);
});
