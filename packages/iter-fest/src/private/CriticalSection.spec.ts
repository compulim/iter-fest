import CriticalSection from './CriticalSection';
import hasResolvedOrRejected from './hasResolvedOrRejected';
import ignoreUnhandledRejection from './ignoreUnhandledRejection';
import { type JestMockOf } from './JestMockOf';

describe('when 2 jobs are pending', () => {
  let criticalSection: CriticalSection;
  let enter1Promise: Promise<number>;
  let enter2Promise: Promise<number>;
  let fn1: JestMockOf<() => Promise<number>>;
  let fn2: JestMockOf<() => Promise<number>>;
  let resolver1: PromiseWithResolvers<number>;
  let resolver2: PromiseWithResolvers<number>;

  beforeEach(() => {
    resolver1 = Promise.withResolvers<number>();
    resolver2 = Promise.withResolvers<number>();

    fn1 = jest.fn().mockImplementationOnce(() => resolver1.promise);
    fn2 = jest.fn().mockImplementationOnce(() => resolver2.promise);

    criticalSection = new CriticalSection();

    enter1Promise = criticalSection.enter(fn1);
    enter2Promise = criticalSection.enter(fn2);
  });

  test('the first job should be running', () => expect(fn1).toHaveBeenCalledTimes(1));
  test('the first entrance should not be resolved', () => expect(hasResolvedOrRejected(enter1Promise)).resolves.toBe(false));
  test('the second job should not be running', () => expect(fn2).not.toHaveBeenCalled());

  describe('when the first job is resolved', () => {
    beforeEach(() => resolver1.resolve(1));

    test('the first entrance should be resolved', () => expect(enter1Promise).resolves.toBe(1));
    test('the second job should be running', () => expect(fn2).toHaveBeenCalledTimes(1));
    test('the second entrance should not be resolved', () => expect(hasResolvedOrRejected(enter2Promise)).resolves.toBe(false));

    describe('when the second job is resolved', () => {
      beforeEach(() => resolver2.resolve(2));

      test('the second entrance should be resolved', () => expect(enter2Promise).resolves.toBe(2));

      describe('when the third job is scheduled', () => {
        let enter3Promise: Promise<number>;
        let fn3: JestMockOf<() => Promise<number>>;
        let resolver3: PromiseWithResolvers<number>;

        beforeEach(() => {
          resolver3 = Promise.withResolvers<number>();
          fn3 = jest.fn().mockImplementationOnce(() => resolver3.promise);

          enter3Promise = criticalSection.enter(fn3);
        });

        test('the third job should be running', () => expect(fn3).toHaveBeenCalledTimes(1));
        test('the third entrance should not be resolved', () =>
          expect(hasResolvedOrRejected(enter3Promise)).resolves.toBe(false));

        test('all jobs should have been run once', () => {
          expect(fn1).toHaveBeenCalledTimes(1);
          expect(fn2).toHaveBeenCalledTimes(1);
          expect(fn3).toHaveBeenCalledTimes(1);
        });

        describe('when the third job is resolved', () => {
          beforeEach(() => resolver3.resolve(3));

          test('the third entrance should be resolved', () => expect(enter3Promise).resolves.toBe(3));
        });
      });
    });
  });

  describe('when the first job is rejected', () => {
    beforeEach(() => {
      ignoreUnhandledRejection(enter1Promise);
      ignoreUnhandledRejection(resolver1.promise);

      resolver1.reject(new Error('Something went wrong'));
    });

    test('the first entrance should be rejected', () =>
      expect(enter1Promise).rejects.toThrow(new Error('Something went wrong')));

    test('the second job should have been called', () => expect(fn2).toHaveBeenCalledTimes(1));

    describe('when the second job is rejected', () => {
      beforeEach(() => {
        ignoreUnhandledRejection(enter2Promise);
        ignoreUnhandledRejection(resolver2.promise);

        resolver2.reject(new Error('Something went wrong'));
      });

      test('the second entrance should be rejected', () =>
        expect(enter2Promise).rejects.toThrow(new Error('Something went wrong')));

      describe('when the third job is scheduled', () => {
        let enter3Promise: Promise<number>;
        let fn3: JestMockOf<() => Promise<number>>;
        let resolver3: PromiseWithResolvers<number>;

        beforeEach(() => {
          resolver3 = Promise.withResolvers<number>();
          fn3 = jest.fn().mockImplementationOnce(() => resolver3.promise);

          enter3Promise = criticalSection.enter(fn3);
        });

        test('the third job should have been called', () => expect(fn3).toHaveBeenCalledTimes(1));

        describe('when the third job is resolved', () => {
          beforeEach(() => resolver3.resolve(3));

          test('the third entrance should be resolved', () => expect(enter3Promise).resolves.toBe(3));
        });
      });
    });
  });
});
