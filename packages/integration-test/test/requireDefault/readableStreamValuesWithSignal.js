const { expect } = require('expect');
const { readableStreamValuesWithSignal } = require('iter-fest');

describe('readableStreamValues', () => {
  it('should work with AbortSignal', async () => {
    const abortController = new AbortController();
    const readableStream = new ReadableStream();

    const values = readableStreamValuesWithSignal(readableStream, { signal: abortController.signal });

    abortController.abort();

    await expect(values.next()).rejects.toThrow(new DOMException('The operation is aborted', 'AbortError'));
  });
});
