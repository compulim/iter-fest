export default class CriticalSection {
  #callbacks: (() => void)[] = [];

  enter<T>(fn: () => Promise<T>): Promise<T> {
    const fnResolver = Promise.withResolvers<T>();

    // const callback = () =>
    //   fn()
    //     .then(
    //       value => fnResolver.resolve(value),
    //       reason => fnResolver.reject(reason)
    //     )
    //     .then(() => {
    //       /* istanbul ignore if */
    //       if (this.#callbacks.shift() !== callback) {
    //         throw new Error('ASSERTION: The first resolver must be self.');
    //       }

    //       this.#callbacks[0]?.();
    //     });

    const callback = async () => {
      try {
        fnResolver.resolve(await fn());
      } catch (error) {
        fnResolver.reject(error);
      }

      /* istanbul ignore if */
      if (this.#callbacks.shift() !== callback) {
        throw new Error('ASSERTION: The first resolver must be self.');
      }

      this.#callbacks[0]?.();
    };

    this.#callbacks.push(callback);

    this.#callbacks[0] === callback && callback();

    return fnResolver.promise;
  }
}
