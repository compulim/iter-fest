import createAbortError from './createAbortError';
import isAbortError from './isAbortError';

describe('when DOMException is not defined globally', () => {
  let originalDOMException: typeof globalThis.DOMException;

  beforeEach(() => {
    originalDOMException = globalThis.DOMException;

    // @ts-expect-error
    globalThis.DOMException = undefined;
  });

  afterEach(() => {
    globalThis.DOMException = originalDOMException;
  });

  test(`should return Error`, async () => {
    const error = createAbortError();

    expect(error).toBeInstanceOf(Error);

    expect(isAbortError(error)).toBe(true);
  });
});

describe('when DOMException is defined globally', () => {
  beforeEach(() => expect(globalThis.DOMException).not.toBeUndefined());

  test(`should return DOMException`, async () => {
    const error = createAbortError();

    expect(error).toBeInstanceOf(DOMException);

    expect(isAbortError(error)).toBe(true);
  });
});
