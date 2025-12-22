import AsyncIteratorMachinery from './AsyncIteratorMachinery';
import hasResolvedOrRejected from './hasResolvedOrRejected';
import ignoreUnhandledRejection from './ignoreUnhandledRejection';
import { type JestMockOf } from './JestMockOf';

test('next() and return() are in the same critical section', async () => {
  type TIterator = AsyncIterator<number, string, boolean>;

  const nextResolver = Promise.withResolvers<IteratorResult<number>>();
  const returnResolver = Promise.withResolvers<IteratorResult<number>>();

  const next: JestMockOf<TIterator['next']> = jest.fn(() => nextResolver.promise);
  const return_: JestMockOf<Exclude<TIterator['return'], undefined>> = jest.fn(() => returnResolver.promise);

  const generator: TIterator = {
    next,
    return: return_
  };

  const machinery = new AsyncIteratorMachinery(generator);

  const nextPromise = machinery.next();
  const returnPromise = machinery.return!('Return');

  await expect(hasResolvedOrRejected(nextPromise)).resolves.toBe(false);
  await expect(hasResolvedOrRejected(returnPromise)).resolves.toBe(false);
  expect(next).toHaveBeenCalledTimes(1);
  expect(return_).not.toHaveBeenCalled();

  nextResolver.resolve({ done: false, value: 1 });

  await expect(nextPromise).resolves.toEqual({ done: false, value: 1 });
  await expect(hasResolvedOrRejected(returnPromise)).resolves.toBe(false);
  expect(next).toHaveBeenCalledTimes(1);
  expect(return_).toHaveBeenCalledTimes(1);

  returnResolver.resolve({ done: true, value: undefined });

  await expect(nextPromise).resolves.toEqual({ done: false, value: 1 });
  await expect(returnPromise).resolves.toEqual({ done: true, value: undefined });
  expect(next).toHaveBeenCalledTimes(1);
  expect(return_).toHaveBeenCalledTimes(1);
});

test('next() and throw() are in the same critical section', async () => {
  type TIterator = AsyncIterator<number, string, boolean>;

  const nextResolver = Promise.withResolvers<IteratorResult<number>>();
  const throwResolver = Promise.withResolvers<any>();

  const next: JestMockOf<TIterator['next']> = jest.fn(() => nextResolver.promise);
  const throw_: JestMockOf<Exclude<TIterator['throw'], undefined>> = jest.fn(() => throwResolver.promise);

  const generator: TIterator = {
    next,
    throw: throw_
  };

  const machinery = new AsyncIteratorMachinery(generator);

  const nextPromise = machinery.next();
  const throwPromise = ignoreUnhandledRejection(machinery.throw!(new Error('Something went wrong')));

  await expect(hasResolvedOrRejected(nextPromise)).resolves.toBe(false);
  await expect(hasResolvedOrRejected(throwPromise)).resolves.toBe(false);
  expect(next).toHaveBeenCalledTimes(1);
  expect(throw_).not.toHaveBeenCalled();

  nextResolver.resolve({ done: false, value: 1 });

  await expect(nextPromise).resolves.toEqual({ done: false, value: 1 });
  await expect(hasResolvedOrRejected(throwPromise)).resolves.toBe(false);
  expect(next).toHaveBeenCalledTimes(1);
  expect(throw_).toHaveBeenCalledTimes(1);

  throwResolver.resolve(undefined);

  await expect(nextPromise).resolves.toEqual({ done: false, value: 1 });
  await expect(throwPromise).resolves.toBeUndefined();
  expect(next).toHaveBeenCalledTimes(1);
  expect(throw_).toHaveBeenCalledTimes(1);
});

test('next() and next() are in the same critical section', async () => {
  const next1Resolver = Promise.withResolvers<1>();
  const next2Resolver = Promise.withResolvers<2>();

  const iterator = (async function* () {
    yield await next1Resolver.promise;
    yield await next2Resolver.promise;
  })();

  const machinery = new AsyncIteratorMachinery(iterator);

  const next1Promise = machinery.next();
  const next2Promise = machinery.next();

  await expect(hasResolvedOrRejected(next1Promise)).resolves.toBe(false);
  await expect(hasResolvedOrRejected(next2Promise)).resolves.toBe(false);

  next1Resolver.resolve(1);

  await expect(next1Promise).resolves.toEqual({ done: false, value: 1 });
  await expect(hasResolvedOrRejected(next2Promise)).resolves.toBe(false);

  next2Resolver.resolve(2);

  await expect(next1Promise).resolves.toEqual({ done: false, value: 1 });
  await expect(next2Promise).resolves.toEqual({ done: false, value: 2 });
});

test('when return() is called, throw() will not be called', async () => {
  type TIterator = AsyncIterator<any, any, any>;

  const nextResolver = Promise.withResolvers<any>();
  const returnResolver = Promise.withResolvers<any>();
  const throwResolver = Promise.withResolvers<any>();

  const underlying: TIterator = {
    next: jest.fn(() => nextResolver.promise),
    return: jest.fn(() => returnResolver.promise),
    throw: jest.fn(() => throwResolver.promise)
  };

  const machinery = new AsyncIteratorMachinery(underlying);

  expect(machinery.return).not.toBeUndefined();
  expect(machinery.throw).not.toBeUndefined();

  const returnPromise = machinery.return!();

  await expect(hasResolvedOrRejected(returnPromise)).resolves.toBe(false);
  expect(underlying.return).toHaveBeenCalledTimes(1);
  expect(underlying.throw).not.toHaveBeenCalled();

  returnResolver.resolve(undefined);

  await expect(returnPromise).resolves.toBeUndefined();

  // --- Even throw() is called, it will not call the underlying throw_().

  const throwPromise = machinery.throw!(new Error('Something went wrong'));

  await expect(throwPromise).rejects.toThrow('Something went wrong');
  expect(underlying.return).toHaveBeenCalledTimes(1);
  expect(underlying.throw).not.toHaveBeenCalled();

  // --- Even next() is called, it will not call the underlying next().

  await expect(machinery.next()).resolves.toEqual({ done: true, value: undefined });
  expect(underlying.next).not.toHaveBeenCalled();
});

test('when throw() is called, return() will not be called', async () => {
  type TIterator = AsyncIterator<any, any, any>;

  const returnResolver = Promise.withResolvers<any>();
  const throwResolver = Promise.withResolvers<any>();

  const underlying: TIterator = {
    next: jest.fn(async () => ({ done: true, value: undefined })),
    return: jest.fn(() => returnResolver.promise),
    throw: jest.fn(() => throwResolver.promise)
  };

  const machinery = new AsyncIteratorMachinery(underlying);

  const throwPromise = ignoreUnhandledRejection(
    machinery.throw!(ignoreUnhandledRejection(Promise.reject('Something went wrong')))
  );

  await expect(hasResolvedOrRejected(throwPromise)).resolves.toBe(false);
  expect(underlying.return).not.toHaveBeenCalled();
  expect(underlying.throw).toHaveBeenCalledTimes(1);

  throwResolver.resolve(undefined);

  await expect(throwPromise).resolves.toBeUndefined();
  expect(underlying.return).not.toHaveBeenCalled();
  expect(underlying.throw).toHaveBeenCalledTimes(1);

  // --- Even return() is called with value or not, it will not call the underlying return().

  await expect(machinery.return!('Done')).resolves.toEqual({ done: true, value: 'Done' });
  await expect(machinery.return!()).resolves.toEqual({ done: true, value: undefined });
  await expect(throwPromise).resolves.toBeUndefined();
  expect(underlying.return).not.toHaveBeenCalled();
  expect(underlying.throw).toHaveBeenCalledTimes(1);

  // --- Even next() is called, it will not call the underlying next().

  await expect(machinery.next()).resolves.toEqual({ done: true, value: undefined });
  expect(underlying.next).not.toHaveBeenCalled();
});

test('[Symbol.asyncIterator]() should return this', () => {
  const underlying: AsyncIterator<number> = {
    next: jest.fn()
  };

  const machinery = new AsyncIteratorMachinery(underlying);

  expect(machinery[Symbol.asyncIterator]()).toBe(machinery);
});

test('next() should call underlying next()', async () => {
  const underlying: AsyncIterator<number> = {
    next: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({ done: false, value: 1 }))
      .mockImplementation(() => Promise.resolve({ done: true, value: undefined }))
  };

  const machinery = new AsyncIteratorMachinery(underlying);

  await expect(machinery.next()).resolves.toEqual({ done: false, value: 1 });

  expect(underlying.next).toHaveBeenCalledTimes(1);

  await expect(machinery.next('Hello, World!')).resolves.toEqual({ done: true, value: undefined });

  expect(underlying.next).toHaveBeenCalledTimes(2);
  expect(underlying.next).toHaveBeenNthCalledWith(2, 'Hello, World!');

  await expect(machinery.next()).resolves.toEqual({ done: true, value: undefined });

  expect(underlying.next).toHaveBeenCalledTimes(2);
});
