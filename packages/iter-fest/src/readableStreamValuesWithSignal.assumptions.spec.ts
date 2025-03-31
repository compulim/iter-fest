import hasResolvedOrRejected from './private/hasResolvedOrRejected';

test('ReadableStreamDefaultReader: releaseLock() twice should not throw', () => {
  const stream = new ReadableStream();
  const reader = stream.getReader();

  reader.releaseLock();

  // ---

  reader.releaseLock();
});

test('ReadableStreamDefaultReader: releaseLock() followed by cancel() should throw', async () => {
  const stream = new ReadableStream();
  const reader = stream.getReader();

  reader.releaseLock();

  // ---

  await expect(reader.cancel()).rejects.toThrow();
});

test('ReadableStreamDefaultReader: cancel() twice should not throw', async () => {
  const stream = new ReadableStream();
  const reader = stream.getReader();

  await reader.cancel();

  // ---

  await reader.cancel();
});

test('ReadableStreamDefaultReader: cancel() followed by releaseLock() should not throw', async () => {
  const stream = new ReadableStream();
  const reader = stream.getReader();

  await reader.cancel();

  // ---

  await expect(reader.read()).resolves.toEqual({ done: true, value: undefined });
  await expect(reader.read()).resolves.toEqual({ done: true, value: undefined });

  // ---

  reader.releaseLock();

  // ---

  await expect(reader.read()).rejects.toThrow(new TypeError('Invalid state: The reader is not attached to a stream'));
});

test('ReadableStreamDefaultReader: cancel() while next() and further next() should resolve undefined', async () => {
  const stream = new ReadableStream();
  const reader = stream.getReader();

  const readPromise = reader.read();

  // ---

  await reader.cancel();

  await expect(readPromise).resolves.toEqual({ done: true, value: undefined });
  await expect(reader.read()).resolves.toEqual({ done: true, value: undefined });
});

test('ReadableStreamDefaultReader: releaseLock() while next() and further next() should reject', async () => {
  const stream = new ReadableStream();
  const reader = stream.getReader();

  const readPromise = reader.read();

  // ---

  await reader.releaseLock();

  await expect(readPromise).rejects.toThrow();
  await expect(reader.read()).rejects.toThrow();
});

test('AsyncGenerator: return() followed by next() should resolve undefined', async () => {
  const values = (async function* () {
    yield 1;
    yield 2;
    yield 3;
  })();

  await expect(values.next()).resolves.toEqual({ done: false, value: 1 });
  await expect(values.return()).resolves.toEqual({ done: true, value: undefined });
  await expect(values.next()).resolves.toEqual({ done: true, value: undefined });
});

test('AsyncGenerator: while next() is pending, calling return() should wait', async () => {
  const resolvers = [Promise.withResolvers(), Promise.withResolvers(), Promise.withResolvers()] as const;

  const values = (async function* () {
    yield await resolvers[0].promise;
    yield await resolvers[1].promise;
    yield await resolvers[2].promise;
  })();

  const nextPromise = values.next();

  await expect(hasResolvedOrRejected(nextPromise)).resolves.toBe(false);

  const returnPromise = values.return();

  await expect(hasResolvedOrRejected(returnPromise)).resolves.toBe(false);
  await expect(hasResolvedOrRejected(nextPromise)).resolves.toBe(false);

  // WHEN: next() is resolved.
  resolvers[0].resolve(1);

  // THEN: next() should be resolved.
  await expect(nextPromise).resolves.toEqual({ done: false, value: 1 });

  // THEN: return() should be resolved.
  await expect(returnPromise).resolves.toEqual({ done: true, value: undefined });

  // --- Subsequent next() should return undefined.

  // WHEN: next() is called again, should resolve with undefined.
  await expect(values.next()).resolves.toEqual({ done: true, value: undefined });
});

test('AsyncGenerator: while next() is pending, calling throw() should wait', async () => {
  const resolvers = [Promise.withResolvers(), Promise.withResolvers(), Promise.withResolvers()] as const;

  const values = (async function* () {
    yield await resolvers[0].promise;
    yield await resolvers[1].promise;
    yield await resolvers[2].promise;
  })();

  const nextPromise = values.next();

  await expect(hasResolvedOrRejected(nextPromise)).resolves.toBe(false);

  const throwPromise = values.throw(new Error('Something went wrong'));

  await expect(hasResolvedOrRejected(throwPromise)).resolves.toBe(false);
  await expect(hasResolvedOrRejected(nextPromise)).resolves.toBe(false);

  // WHEN: next() is resolved.
  resolvers[0].resolve(1);

  // THEN: next() should be resolved.
  await expect(nextPromise).resolves.toEqual({ done: false, value: 1 });

  // THEN: throw() should be resolved.
  await expect(throwPromise).rejects.toThrow(new Error('Something went wrong'));

  // --- Subsequent next() should return undefined.

  // WHEN: next() is called again, should resolve with undefined.
  await expect(values.next()).resolves.toEqual({ done: true, value: undefined });
});

test('AsyncGenerator: next-return-throw-next should be sequential', async () => {
  const order: string[] = [];
  const resolvers = [Promise.withResolvers(), Promise.withResolvers(), Promise.withResolvers()] as const;

  const values = (async function* () {
    yield await resolvers[0].promise;
    yield await resolvers[1].promise;
    yield await resolvers[2].promise;
  })();

  const next1Promise = values.next().then(() => order.push('next1'));

  await expect(hasResolvedOrRejected(next1Promise)).resolves.toBe(false);

  const returnPromise = values.return().then(() => order.push('return'));

  await expect(hasResolvedOrRejected(returnPromise)).resolves.toBe(false);
  await expect(hasResolvedOrRejected(next1Promise)).resolves.toBe(false);

  const throwPromise = values.throw(new Error('Something went wrong')).then(
    () => order.push('throw-resolve'),
    () => order.push('throw-reject')
  );

  await expect(hasResolvedOrRejected(throwPromise)).resolves.toBe(false);

  const next2Promise = values.next().then(() => order.push('next2'));

  await expect(hasResolvedOrRejected(next2Promise)).resolves.toBe(false);

  // WHEN: First next() is resolved.
  resolvers[0].resolve(1);

  await Promise.all([next1Promise, returnPromise, throwPromise, next2Promise]);

  // THEN: The order should be sequential.
  expect(order).toEqual(['next1', 'return', 'throw-reject', 'next2']);
});

test('AsyncGenerator: next-throw-return-next should be sequential', async () => {
  const order: string[] = [];
  const resolvers = [Promise.withResolvers(), Promise.withResolvers(), Promise.withResolvers()] as const;

  const values = (async function* () {
    yield await resolvers[0].promise;
    yield await resolvers[1].promise;
    yield await resolvers[2].promise;
  })();

  const next1Promise = values.next().then(() => order.push('next1'));

  await expect(hasResolvedOrRejected(next1Promise)).resolves.toBe(false);

  const throwPromise = values
    .throw(new Error('Something went wrong'))
    .catch(() => {})
    .then(() => order.push('throw'));

  await expect(hasResolvedOrRejected(throwPromise)).resolves.toBe(false);
  await expect(hasResolvedOrRejected(next1Promise)).resolves.toBe(false);

  const returnPromise = values.return().then(() => order.push('return'));

  await expect(hasResolvedOrRejected(throwPromise)).resolves.toBe(false);
  await expect(hasResolvedOrRejected(returnPromise)).resolves.toBe(false);
  await expect(hasResolvedOrRejected(next1Promise)).resolves.toBe(false);

  const next2Promise = values.next().then(() => order.push('next2'));

  await expect(hasResolvedOrRejected(next2Promise)).resolves.toBe(false);

  // WHEN: First next() is resolved.
  resolvers[0].resolve(1);

  await Promise.all([next1Promise, returnPromise, throwPromise, next2Promise]);

  // THEN: The order should be sequential.
  expect(order).toEqual(['next1', 'throw', 'return', 'next2']);
});

test('AsyncGenerator: calling throw() multiple times should not do anything', async () => {
  const resolvers = [Promise.withResolvers(), Promise.withResolvers(), Promise.withResolvers()] as const;

  const values = (async function* () {
    yield await resolvers[0].promise;
    yield await resolvers[1].promise;
    yield await resolvers[2].promise;
  })();

  const throw1Promise = values.throw(new Error('Something went wrong'));

  await expect(throw1Promise).rejects.toThrow(new Error('Something went wrong'));

  const throw2Promise = values.throw(new Error('Fatal error'));

  await expect(throw2Promise).rejects.toThrow(new Error('Fatal error'));

  await expect(values.next()).resolves.toEqual({ done: true, value: undefined });
});

test('AsyncGenerator: calling return() multiple times should not do anything', async () => {
  const resolvers = [
    Promise.withResolvers<number>(),
    Promise.withResolvers<number>(),
    Promise.withResolvers<number>()
  ] as const;

  const values = (async function* () {
    yield await resolvers[0].promise;
    yield await resolvers[1].promise;
    yield await resolvers[2].promise;

    return 'Some strings';
  })();

  const return1Promise = values.return('First return');

  await expect(return1Promise).resolves.toEqual({ done: true, value: 'First return' });

  const return2Promise = values.return('Second return');

  await expect(return2Promise).resolves.toEqual({ done: true, value: 'Second return' });

  await expect(values.next()).resolves.toEqual({ done: true, value: undefined });
});

test('ReadableStreamDefaultReader: after error(), call cancel() should throw', async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.error(new Error('Something went wrong'));
    }
  });

  const reader = stream.getReader();

  await expect(reader.cancel()).rejects.toEqual(new Error('Something went wrong'));
});
