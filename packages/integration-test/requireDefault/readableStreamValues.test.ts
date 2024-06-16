/* eslint-disable @typescript-eslint/no-var-requires */
const { readableStreamValues } = require('iter-fest');

test('readableStreamValues should work', async () => {
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.close();
    }
  });

  const values = [];

  for await (const value of readableStreamValues(readableStream)) {
    values.push(value);
  }

  expect(values).toEqual([1, 2]);
});
