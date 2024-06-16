/* eslint-disable @typescript-eslint/no-var-requires */
const { Observable } = require('iter-fest/observable');
const { observableSubscribeAsReadable } = require('iter-fest/observableSubscribeAsReadable');

test('observableSubscribeAsReadable should work', async () => {
  const stream = new TextDecoderStream();
  const observable = Observable.from([65, 66, 67]);
  const readable = observableSubscribeAsReadable(observable);
  const numberToInt8Array = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(Int8Array.from([chunk]));
    }
  });

  readable.pipeThrough(numberToInt8Array).pipeTo(stream.writable);

  const reader = stream.readable.getReader();

  await expect(reader.read()).resolves.toEqual({ done: false, value: 'A' });
  await expect(reader.read()).resolves.toEqual({ done: false, value: 'B' });
  await expect(reader.read()).resolves.toEqual({ done: false, value: 'C' });
  await expect(reader.read()).resolves.toEqual({ done: true });
});
