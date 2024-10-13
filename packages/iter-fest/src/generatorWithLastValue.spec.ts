import { generatorWithLastValue, type GeneratorWithLastValue } from './generatorWithLastValue';

test('usage', () => {
  const generator = generatorWithLastValue<number, 'end', void>(
    (function* () {
      yield 1;

      return 'end' as const;
    })()
  );

  for (const value of generator) {
    expect(value).toBe(1);
  }

  expect(generator.lastValue()).toBe('end');
});

describe('comprehensive', () => {
  let generator: GeneratorWithLastValue<number, 'end'>;
  let numTimesGeneratorCalled: number;

  beforeEach(() => {
    numTimesGeneratorCalled = 0;

    generator = generatorWithLastValue(
      (function* () {
        numTimesGeneratorCalled++;

        yield 1;
        yield 2;

        return 'end' as const;
      })()
    );
  });

  test('generator() should not have been called', () => expect(numTimesGeneratorCalled).toBe(0));

  describe('when next() is called', () => {
    let result: IteratorResult<number, string>;

    beforeEach(() => {
      result = generator.next();
    });

    test('generator() should have been called once', () => expect(numTimesGeneratorCalled).toBe(1));
    test('should return 1', () => expect(result).toEqual({ done: false, value: 1 }));
    test('call lastValue() should throw', () =>
      expect(() => generator.lastValue()).toThrow('Iteration has not complete yet, cannot get last value.'));

    describe('when next() is called again', () => {
      let result: IteratorResult<number, string>;

      beforeEach(() => {
        result = generator.next();
      });

      test('generator() should have been called once', () => expect(numTimesGeneratorCalled).toBe(1));
      test('should return 2', () => expect(result).toEqual({ done: false, value: 2 }));
      test('call lastValue() should throw', () =>
        expect(() => generator.lastValue()).toThrow('Iteration has not complete yet, cannot get last value.'));

      describe('when next() is called again', () => {
        let result: IteratorResult<number, string>;

        beforeEach(() => {
          result = generator.next();
        });

        test('generator() should have been called once', () => expect(numTimesGeneratorCalled).toBe(1));
        test('should return done', () => expect(result).toEqual({ done: true, value: 'end' }));
        test('lastValue() should return "end"', () => expect(generator.lastValue()).toBe('end'));
      });
    });
  });
});

test('passthrough next', () => {
  const next = jest.fn<void, [boolean]>();

  const generator = generatorWithLastValue<number, void, boolean>(
    (function* () {
      const value = yield 1;

      next(value);
    })()
  );

  expect(generator.next()).toEqual({ done: false, value: 1 });
  expect(generator.next(true)).toEqual({ done: true, value: undefined });

  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith(true);
});

test('passthrough return', () => {
  const shouldNotCall = jest.fn<void, []>();

  const generator = generatorWithLastValue<number, boolean, unknown>(
    (function* () {
      yield 1;
      shouldNotCall();
      yield 2;

      return false;
    })()
  );

  expect(generator.next()).toEqual({ done: false, value: 1 });
  expect(generator.return(true)).toEqual({ done: true, value: true });

  expect(shouldNotCall).not.toHaveBeenCalled();
});

test('passthrough throw', () => {
  const throw_ = jest.fn<void, [unknown]>();
  const shouldNotCall = jest.fn<void, []>();

  const generator = generatorWithLastValue(
    (function* () {
      try {
        yield 1;
        shouldNotCall();
        yield 2;
      } catch (error) {
        throw_(error);
      }
    })()
  );

  expect(generator.next()).toEqual({ done: false, value: 1 });
  expect(generator.throw('artificial')).toEqual({ done: true, value: undefined });

  expect(throw_).toHaveBeenCalledTimes(1);
  expect(throw_).toHaveBeenNthCalledWith(1, 'artificial');
  expect(shouldNotCall).not.toHaveBeenCalled();
});

test('return in try-finally', () => {
  const generator = generatorWithLastValue<number, 'end' | 'finally', void>(
    (function* () {
      try {
        yield 1;

        return 'end' as const;
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        return 'finally' as const;
      }
    })()
  );

  expect(generator.next()).toEqual({ done: false, value: 1 });

  expect(generator.next()).toEqual({ done: true, value: 'finally' });
  expect(generator.lastValue()).toEqual('finally');

  expect(generator.next()).toEqual({ done: true, value: undefined });
  expect(generator.lastValue()).toEqual(undefined);

  expect(generator.next()).toEqual({ done: true, value: undefined });
  expect(generator.lastValue()).toEqual(undefined);
});

test('passthrough map', () => {
  const generator = (function* () {
    yield 1;
    yield 2;
    yield 3;
  })();

  expect(generator.reduce((sum, value) => sum + value, 0)).toBe(6);
});
