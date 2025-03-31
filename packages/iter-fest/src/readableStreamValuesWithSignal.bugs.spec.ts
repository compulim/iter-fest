// @ts-nocheck

test.skip('readableStream.values() with 2 next() and 1 return()', async () => {
  let controller;
  const stream = new ReadableStream({
    start(c) {
      controller = c;
    }
  });

  const values = stream.values();

  let next1Promise = values.next();
  let next2Promise = values.next();

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

// test('readableStream.values() with preventCancel, return() followed by next() should reject', async () => {
//   const stream = new ReadableStream();

//   const values = stream.values({ preventCancel: true });

//   await values.return();

//   // EXPECT: Reject
//   // ACTUAL: Resolve { done: true, value: undefined }
//   await expect(values.next()).rejects.toThrow();
// });
