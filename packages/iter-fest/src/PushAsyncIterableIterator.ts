import withResolvers from './private/withResolvers';

const CLOSE = Symbol('close');

export class PushAsyncIterableIterator<T> implements AsyncIterableIterator<T> {
  #pushResolvers: PromiseWithResolvers<T | typeof CLOSE> = withResolvers();

  [Symbol.asyncIterator]() {
    return this;
  }

  close() {
    this.#pushResolvers.resolve(CLOSE);
  }

  async next(): Promise<IteratorResult<T>> {
    const value = await this.#pushResolvers.promise;

    if (value === CLOSE) {
      return { done: true, value: undefined };
    }

    return { done: false, value };
  }

  push(value: T) {
    this.#pushResolvers.resolve(value);
    this.#pushResolvers = withResolvers();
  }
}
