import { describe } from 'node:test';
import { format } from 'node:util';

export function describeEach<const T extends any[]>(cases: readonly T[]) {
  return (name: string, fn: (...args: T) => void) => {
    for (const args of cases) {
      describe(format(name, ...args), () => {
        fn(...args);
      });
    }
  };
}
