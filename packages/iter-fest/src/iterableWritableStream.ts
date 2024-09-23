import withResolvers from './private/withResolvers.ts';

const CLOSE = Symbol();

export class IterableWritableStream<T> extends WritableStream<T> {
  constructor() {
    super({
      close: () => {
        this.#buffer.push(CLOSE);
        this.#writeResolvers.resolve();
      },
      write: (chunk: T) => {
        this.#buffer.push(chunk);
        this.#writeResolvers.resolve();
        this.#writeResolvers = withResolvers();
      }
    });
  }

  #buffer: (T | typeof CLOSE)[] = [];
  #writeResolvers: PromiseWithResolvers<void> = withResolvers();

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: async () => {
        while (!this.#buffer.length) {
          await this.#writeResolvers.promise;
        }

        const value = this.#buffer[0] as T | typeof CLOSE;

        if (value === CLOSE) {
          return { done: true, value: undefined };
        }

        // If it is not CLOSE, remove it from the queue.
        this.#buffer.shift();

        // Idle here so concurrent iteration has a chance to pick up the next value in a round robin fashion.
        await undefined;

        return { done: false, value };
      }
    };
  }
}
