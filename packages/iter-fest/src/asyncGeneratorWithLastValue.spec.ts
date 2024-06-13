import { asyncGeneratorWithLastValue, type AsyncGeneratorWithLastValue } from './asyncGeneratorWithLastValue';

test('usage', async () => {
  const generator = asyncGeneratorWithLastValue<number, 'end', void>(
    (async function* () {
      await undefined;

      yield 1;
      await undefined;

      return 'end' as const;
    })()
  );

  for await (const value of generator) {
    expect(value).toBe(1);
  }

  expect(generator.lastValue()).toBe('end');
});

describe('comprehensive', () => {
  let generator: AsyncGeneratorWithLastValue<number, 'end'>;
  let numTimesGeneratorCalled: number;

  beforeEach(() => {
    numTimesGeneratorCalled = 0;

    generator = asyncGeneratorWithLastValue(
      (async function* () {
        numTimesGeneratorCalled++;

        await undefined;
        yield 1;
        await undefined;
        yield 2;
        await undefined;

        return 'end' as const;
      })()
    );
  });

  test('generator() should not have been called', () => expect(numTimesGeneratorCalled).toBe(0));

  describe('when next() is called', () => {
    let result: IteratorResult<number, string>;

    beforeEach(async () => {
      result = await generator.next();
    });

    test('generator() should have been called once', () => expect(numTimesGeneratorCalled).toBe(1));
    test('should return 1', () => expect(result).toEqual({ done: false, value: 1 }));
    test('call lastValue() should throw', () =>
      expect(() => generator.lastValue()).toThrow('Iteration has not complete yet, cannot get last value.'));

    describe('when next() is called again', () => {
      let result: IteratorResult<number, string>;

      beforeEach(async () => {
        result = await generator.next();
      });

      test('generator() should have been called once', () => expect(numTimesGeneratorCalled).toBe(1));
      test('should return 2', () => expect(result).toEqual({ done: false, value: 2 }));
      test('call lastValue() should throw', () =>
        expect(() => generator.lastValue()).toThrow('Iteration has not complete yet, cannot get last value.'));

      describe('when next() is called again', () => {
        let result: IteratorResult<number, string>;

        beforeEach(async () => {
          result = await generator.next();
        });

        test('generator() should have been called once', () => expect(numTimesGeneratorCalled).toBe(1));
        test('should return done', () => expect(result).toEqual({ done: true, value: 'end' }));
        test('lastValue() should return "end"', () => expect(generator.lastValue()).toBe('end'));
      });
    });
  });
});

test('passthrough next', async () => {
  const next = jest.fn<void, [boolean]>();

  const generator = asyncGeneratorWithLastValue<number, void, boolean>(
    (async function* () {
      await undefined;

      const value = yield 1;

      await undefined;

      next(value);
    })()
  );

  await expect(generator.next()).resolves.toEqual({ done: false, value: 1 });
  await expect(generator.next(true)).resolves.toEqual({ done: true, value: undefined });

  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith(true);
});

test('passthrough return', async () => {
  const shouldNotCall = jest.fn<void, []>();

  const generator = asyncGeneratorWithLastValue<number, boolean, unknown>(
    (async function* () {
      await undefined;

      yield 1;
      await undefined;

      shouldNotCall();
      await undefined;

      yield 2;
      await undefined;

      return false;
    })()
  );

  await expect(generator.next()).resolves.toEqual({ done: false, value: 1 });
  await expect(generator.return(true)).resolves.toEqual({ done: true, value: true });

  expect(shouldNotCall).not.toHaveBeenCalled();
});

test('passthrough throw', async () => {
  const throw_ = jest.fn<void, [unknown]>();
  const shouldNotCall = jest.fn<void, []>();

  const generator = asyncGeneratorWithLastValue(
    (async function* () {
      try {
        await undefined;

        yield 1;
        await undefined;

        shouldNotCall();
        await undefined;

        yield 2;
        await undefined;
      } catch (error) {
        throw_(error);
      }
    })()
  );

  await expect(generator.next()).resolves.toEqual({ done: false, value: 1 });
  await expect(generator.throw('artificial')).resolves.toEqual({ done: true, value: undefined });

  expect(throw_).toHaveBeenCalledTimes(1);
  expect(throw_).toHaveBeenNthCalledWith(1, 'artificial');
  expect(shouldNotCall).not.toHaveBeenCalled();
});
