const { expect } = require('expect');
const { readableStreamValuesWithSignal } = require('iter-fest');
const { describe, it } = require('node:test');

describe('readableStreamValuesWithSignal', () => {
  it('should work with AbortSignal', async () => {
    const abortController = new AbortController();
    const readableStream = new ReadableStream();

    const values = readableStreamValuesWithSignal(readableStream, { signal: abortController.signal });

    abortController.abort();

    await expect(values.next()).rejects.toThrow(new DOMException('The operation is aborted', 'AbortError'));
  });
});
