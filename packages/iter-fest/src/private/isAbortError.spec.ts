import isAbortError from './isAbortError';

test('should return true for AbortError from fetch()', async () => {
  const abortController = new AbortController();

  abortController.abort();

  const resPromise = fetch('https://example.com/', { signal: abortController.signal });

  await expect(resPromise).rejects.toThrow();
  await expect(resPromise.catch(error => isAbortError(error))).resolves.toBe(true);
});

describe('when DOMException is not defined globally', () => {
  let originalDOMException: typeof globalThis.DOMException;

  beforeEach(() => {
    originalDOMException = globalThis.DOMException;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    globalThis.DOMException = undefined;
  });

  afterEach(() => {
    globalThis.DOMException = originalDOMException;
  });

  test(`should return true for Error.name === 'AbortError'`, async () => {
    const abortError = new Error();

    abortError.name = 'AbortError';

    expect(isAbortError(abortError)).toBe(true);
  });
});

describe('when DOMException is defined globally', () => {
  beforeEach(() => expect(globalThis.DOMException).not.toBeUndefined());

  test(`should return false for Error.name === 'AbortError'`, async () => {
    const abortError = new Error();

    abortError.name = 'AbortError';

    expect(isAbortError(abortError)).toBe(false);
  });
});
