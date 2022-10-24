import { Exception } from '../../../../exceptions';
import { AssertionResult } from '../../../models/assertion-result/assertion-result';
import { JestExceptionsExtensionsService } from './jest-exceptions-extensions-service';

describe('Jest Exceptions Extensions Service Test Suite', () => {
    const service = new JestExceptionsExtensionsService();

    describe('assertActionThrowsExpectedException', () => {
        test('Should return a passing assertion when the action throws the expected exception', () => {
            const action = jest.fn(() => {
                throw new Exception();
            });
            const expectedException = new Exception();
            const expectedAssertionResult = new AssertionResult('', true);

            const actualAssertionResult =
                service.assertActionThrowsExpectedException(
                    action,
                    expectedException
                );

            expect(actualAssertionResult).toEqual(expectedAssertionResult);
            expect(action).toBeCalledTimes(1);
        });

        test('Should return a failing assertion when the action throws an unequivalent exception', () => {
            const action = jest.fn(() => {
                throw new Exception();
            });
            const expectedException = new Exception(
                'A message',
                new Error(),
                new Map([['key', ['some data']]])
            );
            expectedException.name = 'RandomException';
            const expectedAssertionResult = new AssertionResult(
                [
                    'Expected exception name to be "RandomException", was "Exception".',
                    'Expected exception message to be "A message", was "".',
                    '- Expected map item count to be 1, but found 0.',
                    "- Expected to find key 'key'.",
                ].join('\n'),
                false
            );

            const actualAssertionResult =
                service.assertActionThrowsExpectedException(
                    action,
                    expectedException
                );

            expect(actualAssertionResult).toEqual(expectedAssertionResult);
            expect(action).toBeCalledTimes(1);
        });

        test('Should return a failing assertion when the action does not throw an exception', () => {
            const action = jest.fn(() => {});
            const expectedException = new Exception();
            const expectedAssertionResult = new AssertionResult(
                'Expected action to throw an exception.',
                false
            );

            const actualAssertionResult =
                service.assertActionThrowsExpectedException(
                    action,
                    expectedException
                );

            expect(actualAssertionResult).toEqual(expectedAssertionResult);
            expect(action).toBeCalledTimes(1);
        });

        test('Should return a failing assertion when the action is not a function', () => {
            const action = 'a value';
            const expectedException = new Exception();
            const expectedAssertionResult = new AssertionResult(
                "Expected 'action' to be a function.",
                false
            );

            const actualAssertionResult =
                service.assertActionThrowsExpectedException(
                    action,
                    expectedException
                );

            expect(actualAssertionResult).toEqual(expectedAssertionResult);
        });

        test('Should return a failing assertion when the expected exception is not an exception', () => {
            const action = () => {
                throw new Exception();
            };
            const expectedException = 'a value';
            const expectedAssertionResult = new AssertionResult(
                "Expected 'expectedException' to be an Exception.",
                false
            );

            const actualAssertionResult =
                service.assertActionThrowsExpectedException(
                    action,
                    expectedException
                );

            expect(actualAssertionResult).toEqual(expectedAssertionResult);
        });
    });

    describe('assertActionThrowsExpectedExceptionAsync', () => {
        test('Should return a passing assertion when the action throws the expected exception', async () => {
            const action = jest.fn(async () => {
                throw new Exception();
            });
            const expectedException = new Exception();
            const expectedAssertionResult = new AssertionResult('', true);

            const actualAssertionResult =
                await service.assertActionThrowsExpectedExceptionAsync(
                    action,
                    expectedException
                );

            expect(actualAssertionResult).toEqual(expectedAssertionResult);
            expect(action).toBeCalledTimes(1);
        });

        test('Should return a failing assertion when the action throws an unequivalent exception', async () => {
            const action = jest.fn(async () => {
                throw new Exception();
            });
            const expectedException = new Exception(
                'A message',
                new Error(),
                new Map([['key', ['some data']]])
            );
            expectedException.name = 'RandomException';
            const expectedAssertionResult = new AssertionResult(
                [
                    'Expected exception name to be "RandomException", was "Exception".',
                    'Expected exception message to be "A message", was "".',
                    '- Expected map item count to be 1, but found 0.',
                    "- Expected to find key 'key'.",
                ].join('\n'),
                false
            );

            const actualAssertionResult =
                await service.assertActionThrowsExpectedExceptionAsync(
                    action,
                    expectedException
                );

            expect(actualAssertionResult).toEqual(expectedAssertionResult);
            expect(action).toBeCalledTimes(1);
        });

        test('Should return a failing assertion when the action does not throw an exception', async () => {
            const action = jest.fn(async () => {});
            const expectedException = new Exception();
            const expectedAssertionResult = new AssertionResult(
                'Expected action to throw an exception.',
                false
            );

            const actualAssertionResult =
                await service.assertActionThrowsExpectedExceptionAsync(
                    action,
                    expectedException
                );

            expect(actualAssertionResult).toEqual(expectedAssertionResult);
            expect(action).toBeCalledTimes(1);
        });

        test('Should return a failing assertion when the action is not a function', async () => {
            const action = 'a value';
            const expectedException = new Exception();
            const expectedAssertionResult = new AssertionResult(
                "Expected 'action' to be a function.",
                false
            );

            const actualAssertionResult =
                await service.assertActionThrowsExpectedExceptionAsync(
                    action,
                    expectedException
                );

            expect(actualAssertionResult).toEqual(expectedAssertionResult);
        });

        test('Should return a failing assertion when the expected exception is not an exception', async () => {
            const action = () => {
                throw new Exception();
            };
            const expectedException = 'a value';
            const expectedAssertionResult = new AssertionResult(
                "Expected 'expectedException' to be an Exception.",
                false
            );

            const actualAssertionResult =
                await service.assertActionThrowsExpectedExceptionAsync(
                    action,
                    expectedException
                );

            expect(actualAssertionResult).toEqual(expectedAssertionResult);
        });
    });
});
