const ERROR_MESSAGE = 'The operation is aborted';
const ERROR_NAME = 'AbortError';

export default function createAbortError(): (DOMException & { name: 'AbortError' }) | Error {
  if (typeof globalThis.DOMException === 'undefined') {
    const error = new Error(ERROR_MESSAGE);

    error.name = ERROR_NAME;

    return error;
  } else {
    return new DOMException(ERROR_MESSAGE, ERROR_NAME);
  }
}
