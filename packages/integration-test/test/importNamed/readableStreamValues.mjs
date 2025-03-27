import { expect } from 'expect';
import { readableStreamValues } from 'iter-fest/readableStreamValues';

describe('readableStreamValues', () => {
  it('should work', async () => {
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

  it('should work with AbortSignal', async () => {
    const abortController = new AbortController();
    const readableStream = new ReadableStream();

    const values = readableStreamValues(readableStream, { signal: abortController.signal });

    abortController.abort();

    await expect(values.next()).rejects.toThrow('Aborted');
  });
});
