/* eslint-disable @typescript-eslint/no-var-requires */
const { readerValues } = require('iter-fest/readerValues');

test('readerValues should work', async () => {
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.close();
    }
  });

  const values = [];

  for await (const value of readerValues(readableStream.getReader())) {
    values.push(value);
  }

  expect(values).toEqual([1, 2]);
});
