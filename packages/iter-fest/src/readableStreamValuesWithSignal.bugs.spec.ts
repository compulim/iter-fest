/* eslint-disable */
// @ts-nocheck

test.skip('readableStream.values() with 2 next() and 1 return()', async () => {
  let controller;
  const stream = new ReadableStream({
    start(c) {
      controller = c;
    }
  });

  const values = stream.values();

  const next1Promise = values.next();
  const next2Promise = values.next();

  controller.enqueue(1);

  await next1Promise;

  values.return();
});

test.skip('readableStream.values(), return() should not return reason', async () => {
  const stream = new ReadableStream();

  const values = stream.values({ preventCancel: true });

  const returnResult = await values.return('Cancellation reason');

  // EXPECT: { done: true, value: undefined }
  // ACTUAL: { done: true, value: 'Cancellation reason' }
  expect(returnResult).toEqual({ done: true, value: undefined });
});
