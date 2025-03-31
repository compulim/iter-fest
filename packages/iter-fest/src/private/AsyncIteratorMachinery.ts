import CriticalSection from './CriticalSection';

/**
 * This machinery protect the logic of iterator/generator. It guarantees:
 *
 * - next(), return(), throw() are in the same critical section
 *    - They will be processed sequentially
 * - When the iterator is done
 *    - next() will always return { done: true, value: undefined }
 *    - return(value) will always return { done: true, value }, without calling underlying return()
 *    - throw(reason) will always throw reason, without calling underlying throw()
 */
export default class AsyncIteratorMachinery<T, TReturn, TNext> implements AsyncIteratorObject<T, TReturn, TNext> {
  constructor(iterator: AsyncIterator<T, TReturn, TNext>) {
    this.#criticalSection = new CriticalSection();
    this.#done = false;

    const enter = this.#criticalSection.enter.bind(this.#criticalSection);

    const return_ = iterator.return && iterator.return.bind(iterator);
    const throw_ = iterator.throw && iterator.throw.bind(iterator);

    this.next = (...[value]) =>
      enter(async () => {
        if (this.#done) {
          // Seems a bug in TypeScript that it doesn't allow undefined as TReturn for AsyncIterator
          return Promise.resolve({ done: true, value: undefined as TReturn });
        }

        const result = await iterator.next(...(value ? [value] : []));

        if (result.done) {
          this.#done = true;
        }

        return result;
      });

    if (return_) {
      this.return = value =>
        enter(async () => {
          if (this.#done) {
            return {
              done: true,
              value: typeof value === 'undefined' ? (value as TReturn) : await value
            };
          }

          this.#done = true;

          return return_(value);
        });
    }

    if (throw_) {
      this.throw = reason =>
        enter(() => {
          if (this.#done) {
            return Promise.reject(reason);
          }

          this.#done = true;

          return throw_(reason);
        });
    }
  }

  #criticalSection: CriticalSection;
  #done: boolean;

  async [Symbol.asyncDispose]() {}

  [Symbol.asyncIterator]() {
    return this;
  }

  next: (...[value]: [] | [TNext]) => Promise<IteratorResult<T, TReturn>>;
  return?: (value?: TReturn | PromiseLike<TReturn> | undefined) => Promise<IteratorResult<T, TReturn>>;
  throw?: (e?: any) => Promise<IteratorResult<T, TReturn>>;
}
