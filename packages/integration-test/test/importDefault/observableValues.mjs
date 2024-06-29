import { expect } from 'expect';
import { Observable, observableValues } from 'iter-fest';

describe('observableValues', () => {
  it('should work', async () => {
    const observable = Observable.from([1, 2, 3]);
    const values = [];

    for await (const value of observableValues(observable)) {
      values.push(value);
    }

    expect(values).toEqual([1, 2, 3]);
  });
});
