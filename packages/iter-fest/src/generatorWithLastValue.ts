const STILL_ITERATING = Symbol();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GeneratorWithLastValue<T = unknown, TReturn = any, TNext = unknown> = Generator<T, TReturn, TNext> & {
  lastValue(): TReturn;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generatorWithLastValue<T = unknown, TReturn = any, TNext = unknown>(
  generator: Generator<T, TReturn, TNext>
): GeneratorWithLastValue<T, TReturn, TNext> {
  let lastValue: typeof STILL_ITERATING | TReturn = STILL_ITERATING;

  const generatorWithLastValue = {
    ...generator,
    [Symbol.iterator]() {
      return generatorWithLastValue;
    },
    lastValue(): TReturn {
      if (lastValue === STILL_ITERATING) {
        throw new Error('Iteration has not complete yet, cannot get last value.');
      }

      return lastValue;
    },
    next(next: TNext) {
      const result = generator.next(next);

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

  return generatorWithLastValue;
}
