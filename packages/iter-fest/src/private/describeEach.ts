// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore TypeScript cannot find node:test.
import { describe } from 'node:test';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore TypeScript cannot find node:test.
import { format } from 'node:util';

export function describeEach<const T extends unknown[]>(cases: readonly T[]) {
  return (name: string, fn: (...args: T) => void) => {
    for (const args of cases) {
      describe(format(name, ...args), () => {
        fn(...args);
      });
    }
  };
}
