import abortSignalAsRejectedPromise from './abortSignalAsRejectedPromise';

describe('when aborted initially', () => {
  let abortController: AbortController;
  let promise: Promise<never>;

  beforeEach(() => {
    abortController = new AbortController();
    abortController.abort();
    promise = abortSignalAsRejectedPromise(abortController.signal);
  });

  test('should throw', () => expect(promise).rejects.toThrow('Aborted'));
});

describe('when aborted after await', () => {
  let abortController: AbortController;
  let promise: Promise<never>;

  beforeEach(() => {
    abortController = new AbortController();
    promise = abortSignalAsRejectedPromise(abortController.signal);
    abortController.abort();
  });

  test('should throw', () => expect(promise).rejects.toThrow('Aborted'));
});

describe('when not aborted', () => {
  let abortController: AbortController;
  let promise: Promise<never>;

  beforeEach(() => {
    abortController = new AbortController();
    promise = abortSignalAsRejectedPromise(abortController.signal);
  });

  test('should not resolve or reject', () => expect(Promise.race([Promise.resolve(0), promise])).resolves.toBe(0));
});
