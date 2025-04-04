import AsyncIteratorMachinery from './private/AsyncIteratorMachinery.ts';
import createAbortError from './private/createAbortError.ts';

type ReadableStreamIteratorWithSignalOptions = ReadableStreamIteratorOptions & {
  signal?: AbortSignal | undefined;
};

type ReadableStreamIteratorReadRequest<T> = {
  chunk(value: T): void;
  close(): void;
  error(error: unknown): void;
};

class ReadableStreamIterator<T> implements ReadableStreamAsyncIterator<T> {
  // The asynchronous iterator initialization steps for a ReadableStream, given stream, iterator, and args, are:
  constructor(
    stream: ReadableStream<T>,
    args: [{ preventCancel?: boolean | undefined; signal?: AbortSignal | undefined }]
  ) {
    // 1. Let reader be ? AcquireReadableStreamDefaultReader(stream).
    const reader = stream.getReader();

    // 2. Set iterator’s reader to reader.
    this.#reader = reader;

    // 3. Let preventCancel be args[0]["preventCancel"].
    const preventCancel = !!args[0].preventCancel;

    // 4. Set iterator’s prevent cancel to preventCancel.
    this.#preventCancel = preventCancel;

    this.#signal = args[0].signal;

    this.#signal?.addEventListener(
      'abort',
      async () => {
        // Ignore cancel() rejections.
        this.#preventCancel || reader.cancel(createAbortError());

        reader.releaseLock();
      },
      { once: true }
    );
  }

  #preventCancel: boolean;
  #reader: ReadableStreamDefaultReader<T>;
  #readRequests: ReadableStreamIteratorReadRequest<T>[] = [];
  #signal: AbortSignal | undefined;

  [Symbol.asyncIterator]() {
    return this;
  }

  async [Symbol.asyncDispose]() {}

  // The get the next iteration result steps for a ReadableStream, given stream and iterator, are:
  // next(...[value]: [] | [any]): Promise<IteratorResult<T, any>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => Promise<IteratorResult<T, any>> = () => {
    if (this.#signal?.aborted) {
      return Promise.reject(createAbortError());
    }

    // Iterator machinery: iterator is busy, don't start return().
    const nextResolvers = Promise.withResolvers<void>();

    // 1. Let reader be iterator’s reader.
    const reader = this.#reader;

    // 2. Assert: reader.[[stream]] is not undefined.

    // 3. Let promise be a new promise.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolvers = Promise.withResolvers<IteratorResult<T, any>>();

    // 4. Let readRequest be a new read request with the following items:
    const request: ReadableStreamIteratorReadRequest<T> = {
      // chunk steps, given chunk
      chunk(value) {
        // Resolve promise with chunk.
        resolvers.resolve({ done: false, value });
      },
      // close steps
      close() {
        // Perform ! ReadableStreamDefaultReaderRelease(reader).
        reader.releaseLock();

        // Resolve promise with end of iteration.
        resolvers.resolve({ done: true, value: undefined });
      },
      // error steps, given e
      error(reason) {
        // Perform ! ReadableStreamDefaultReaderRelease(reader).
        reader.releaseLock();

        // Reject promise with e.
        resolvers.reject(reason);
      }
    };

    this.#readRequests.push(request);

    // 5. Perform ! ReadableStreamDefaultReaderRead(this, readRequest).
    (async () => {
      try {
        const result = await reader.read();

        if (result.done) {
          if (this.#signal?.aborted) {
            request.error(createAbortError());
          }

          request.close();
        } else {
          request.chunk(result.value);
        }
      } catch (error) {
        if (this.#signal?.aborted) {
          request.error(createAbortError());
        } else {
          request.error(error);
        }
      } finally {
        nextResolvers.resolve();
      }
    })();

    // 6. Return promise.
    return resolvers.promise;
  };

  // The asynchronous iterator return steps for a ReadableStream, given stream, iterator, and arg, are:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async return(value?: any): Promise<IteratorResult<T, any>> {
    if (this.#signal?.aborted) {
      return Promise.reject(createAbortError());
    }

    // 1. Let reader be iterator’s reader.
    const reader = this.#reader;
    // 2. Assert: reader.[[stream]] is not undefined.
    // 3. Assert: reader.[[readRequests]] is empty, as the async iterator machinery guarantees that any previous calls to next() have settled before this is called.

    // 4. If iterator’s prevent cancel is false:
    if (!this.#preventCancel) {
      // 1. Let result be ! ReadableStreamReaderGenericCancel(reader, arg).
      const cancelPromise = reader.cancel(value);

      // --- Seems WHATWG spec bug: if stream errored, we will fail at cancel() and would never able to call releaseLock(). ---
      // --- Instead, regardless cancel() failed or not, we should release the reader lock. ---

      // 2. Perform ! ReadableStreamDefaultReaderRelease(reader).
      reader.releaseLock();

      await cancelPromise;

      // 3. Return result.
      // --- Seems Node.js 22.14.0 implementation is different from W3C spec, see https://github.com/nodejs/node/issues/57681 ---
      // return { done: true, value: undefined };
      return { done: true, value };
    }

    // 5. Perform ! ReadableStreamDefaultReaderRelease(reader).
    reader.releaseLock();

    // 6. Return a promise resolved with undefined.
    // --- Seems Node.js 22.14.0 implementation is different from W3C spec, see https://github.com/nodejs/node/issues/57681 ---
    // return { done: true, value: undefined };
    return { done: true, value };
  }
}

/**
 * This is based on WHATWG Streams Asynchronous Iteration specification.
 *
 * @see https://streams.spec.whatwg.org/#rs-asynciterator
 *
 * @param stream
 * @param options
 * @returns
 */
export function readableStreamValuesWithSignal<T>(
  stream: ReadableStream<T>,
  options?: ReadableStreamIteratorWithSignalOptions | undefined
): ReadableStreamAsyncIterator<T> {
  return new AsyncIteratorMachinery(new ReadableStreamIterator(stream, [options || {}]));
}

export { type ReadableStreamIteratorWithSignalOptions };
