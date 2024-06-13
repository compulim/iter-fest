const STILL_ITERATING = Symbol();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncGeneratorWithLastValue<T = unknown, TReturn = any, TNext = unknown> = AsyncGenerator<
  T,
  TReturn,
  TNext
> & {
  lastValue(): TReturn;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asyncGeneratorWithLastValue<T = unknown, TReturn = any, TNext = unknown>(
  generator: AsyncGenerator<T, TReturn, TNext>
): AsyncGeneratorWithLastValue<T, TReturn, TNext> {
  let lastValue: typeof STILL_ITERATING | TReturn = STILL_ITERATING;

  const asyncGeneratorWithLastValue = {
    [Symbol.asyncIterator]() {
      return asyncGeneratorWithLastValue;
    },
    lastValue(): TReturn {
      if (lastValue === STILL_ITERATING) {
        throw new Error('Iteration has not complete yet, cannot get last value.');
      }

      return lastValue;
    },
    async next(next: TNext) {
      const result = await generator.next(next);

      if (result.done) {
        lastValue = result.value;
      }

      return result;
    },
    return(value: TReturn) {
      return generator.return(value);
    },
    throw(error: unknown) {
      return generator.throw(error);
    }
  };

  return asyncGeneratorWithLastValue;
}
