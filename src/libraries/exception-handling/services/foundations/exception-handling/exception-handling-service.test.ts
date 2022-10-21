import {
    anyFunction,
    anything,
    instance,
    mock,
    reset,
    verify,
    when,
} from 'ts-mockito';
import { Exception } from '../../../../exceptions/exception';
import { ExceptionActionBroker } from '../../../brokers/exception-actions/exception-action-broker';
import { NullExceptionActionException } from '../../../models/exception-handling/exceptions/null-exception-action-exception';
import { NullExceptionPatternList } from '../../../models/exception-handling/exceptions/null-exception-pattern-list';
import { NullFunctionException } from '../../../models/exception-handling/exceptions/null-function-exception';
import { ExceptionHandlingService } from './exception-handling-service';
import { ExceptionHandlingDependencyException } from './exceptions/exception-handling-dependency-exception';
import { ExceptionHandlingValidationException } from './exceptions/exception-handling-validation-exception';
import { FailedExceptionActionStorageException } from './exceptions/failed-exception-action-storage-exception';

class HigherLevelException extends Exception {
    constructor(innerException: Exception) {
        super('', innerException);
    }
}

describe('Exception Handling Service Test Suite', () => {
    const mockedExceptionActionBroker = mock(ExceptionActionBroker);
    const service = new ExceptionHandlingService(
        instance(mockedExceptionActionBroker)
    );

    beforeEach(() => {
        reset(mockedExceptionActionBroker);
    });

    describe('tryCatch', () => {
        test('Should return the value of the function when it does not throw', () => {
            const result = 'success';
            const expectedResult = result;
            const inputFunction = () => {
                return result;
            };

            const actualResult = service.tryCatch(inputFunction).execute();

            expect(actualResult).toEqual(expectedResult);
            verify(mockedExceptionActionBroker.getAction(anything())).never();
            verify(
                mockedExceptionActionBroker.addAction(anything(), anyFunction())
            ).never();
        });

        test('Should throw the exception produced by the function', () => {
            const thrownError = new Exception();
            const expectedException = thrownError;
            const inputFunction = () => {
                throw thrownError;
            };

            const actualChain = service.tryCatch(inputFunction);
            expect(actualChain.execute).toThrowException(expectedException);

            verify(mockedExceptionActionBroker.getAction(Exception)).once();
        });

        test('Should throw a validation exception when a null function is provided', () => {
            const inputFunction = null as any;
            const nullException = new NullFunctionException();
            const expectedException = new ExceptionHandlingValidationException(
                nullException
            );

            const action = () => service.tryCatch(inputFunction).execute();
            expect(action).toThrowException(expectedException);

            verify(mockedExceptionActionBroker.getAction(anything())).never();
        });

        test('Should throw a validation exception when a null pattern is provided', () => {
            const inputFunction = () => {};
            const nullException = new NullExceptionPatternList();
            const inputPatterns = null as any;
            const defaultAction = () => new Exception();
            const expectedException = new ExceptionHandlingValidationException(
                nullException
            );

            const action = () =>
                service
                    .tryCatch(inputFunction)
                    .handle(inputPatterns, defaultAction);
            expect(action).toThrowException(expectedException);

            verify(
                mockedExceptionActionBroker.addAction(anything(), anyFunction())
            ).never();
        });

        test('Should throw a validation exception when a null action is provided', () => {
            const inputFunction = () => {};
            const nullException = new NullExceptionActionException();
            const defaultAction = null as any;
            const expectedException = new ExceptionHandlingValidationException(
                nullException
            );

            const action = () =>
                service.tryCatch(inputFunction).handle([], defaultAction);
            expect(action).toThrowException(expectedException);

            verify(
                mockedExceptionActionBroker.addAction(anything(), anyFunction())
            ).never();
        });

        test('Should add the pattern to be matched when catching an exception thrown by the function', () => {
            const inputFunction = () => {
                throw new Exception();
            };

            const actualChain = service.tryCatch(inputFunction);
            actualChain.handle(
                [Exception, HigherLevelException],
                (exception) => new HigherLevelException(exception)
            );

            verify(
                mockedExceptionActionBroker.addAction(Exception, anyFunction())
            ).once();
            verify(
                mockedExceptionActionBroker.addAction(
                    HigherLevelException,
                    anyFunction()
                )
            ).once();
        });

        test('Should correctly create exception when given multiple patterns to be matched and the function throws', () => {
            const thrownException = new Exception();
            const inputFunction = () => {
                throw thrownException;
            };
            const higherLevelExceptionFactory = (exception: Exception) =>
                new HigherLevelException(exception);
            const expectedException = new HigherLevelException(thrownException);
            when(mockedExceptionActionBroker.getAction(Exception)).thenReturn(
                higherLevelExceptionFactory
            );

            const actualChain = service.tryCatch(inputFunction);
            const action = () =>
                actualChain
                    .handle([Exception], higherLevelExceptionFactory)
                    .handle(
                        [HigherLevelException],
                        () => new Exception('Should not have hit this mapping')
                    )
                    .execute();
            expect(action).toThrowException(expectedException);

            verify(
                mockedExceptionActionBroker.addAction(
                    HigherLevelException,
                    anyFunction()
                )
            ).once();
            verify(
                mockedExceptionActionBroker.addAction(Exception, anyFunction())
            ).once();
            verify(mockedExceptionActionBroker.getAction(Exception)).once();
        });
    });

    describe('tryCatchAsync', () => {
        test('Should throw a validation exception when the function is null', () => {
            const nullException = new NullFunctionException();
            const expectedException = new ExceptionHandlingValidationException(
                nullException
            );
            const inputFunction = null as any;

            const action = () => service.tryCatchAsync(inputFunction);
            expect(action).toThrowException(expectedException);

            verify(mockedExceptionActionBroker.getAction(anything())).never();
            verify(
                mockedExceptionActionBroker.addAction(anything(), anyFunction())
            ).never();
        });

        test('Should return the value of the function when it does not throw', async () => {
            const result = 'success';
            const expectedResult = result;
            const inputFunction = async () => {
                return result;
            };

            const actualResult = await service
                .tryCatchAsync(inputFunction)
                .execute();

            expect(actualResult).toEqual(expectedResult);
            verify(mockedExceptionActionBroker.getAction(anything())).never();
            verify(
                mockedExceptionActionBroker.addAction(anything(), anyFunction())
            ).never();
        });

        test('Should throw the exception produced by the function', async () => {
            const thrownError = new Exception();
            const expectedException = thrownError;
            const inputFunction = async () => {
                throw thrownError;
            };

            const actualChain = service.tryCatchAsync(inputFunction);
            const action = actualChain.execute();
            await expect(action).rejects.toThrowException(expectedException);

            verify(mockedExceptionActionBroker.getAction(anything())).once();
        });

        test('Should throw a validation exception when a null pattern is provided', async () => {
            const inputFunction = async () => {};
            const nullException = new NullExceptionPatternList();
            const inputPatterns = null as any;
            const defaultAction = () => new Exception();
            const expectedException = new ExceptionHandlingValidationException(
                nullException
            );

            const action = () =>
                service
                    .tryCatchAsync(inputFunction)
                    .handle(inputPatterns, defaultAction);
            expect(action).toThrowException(expectedException);

            verify(
                mockedExceptionActionBroker.addAction(anything(), anyFunction())
            ).never();
        });

        test('Should throw a validation exception when a null action is provided', () => {
            const inputFunction = async () => {};
            const nullException = new NullExceptionActionException();
            const defaultAction = null as any;
            const expectedException = new ExceptionHandlingValidationException(
                nullException
            );

            const action = () =>
                service.tryCatchAsync(inputFunction).handle([], defaultAction);
            expect(action).toThrowException(expectedException);

            verify(
                mockedExceptionActionBroker.addAction(anything(), anyFunction())
            ).never();
        });

        test('Should add the pattern to be matched when catching an exception thrown by the function', () => {
            const inputFunction = async () => {
                throw new Exception();
            };

            const actualChain = service.tryCatchAsync(inputFunction);
            actualChain.handle(
                [Exception, HigherLevelException],
                (exception) => new HigherLevelException(exception)
            );

            verify(
                mockedExceptionActionBroker.addAction(Exception, anyFunction())
            ).once();
            verify(
                mockedExceptionActionBroker.addAction(
                    HigherLevelException,
                    anyFunction()
                )
            ).once();
        });

        test('Should correctly create exception when given multiple patterns to be matched and the function throws', async () => {
            const thrownException = new Exception();
            const inputFunction = async () => {
                throw thrownException;
            };
            const higherLevelExceptionFactory = (exception: Exception) =>
                new HigherLevelException(exception);
            const expectedException = new HigherLevelException(thrownException);
            when(mockedExceptionActionBroker.getAction(Exception)).thenReturn(
                higherLevelExceptionFactory
            );

            const actualChain = service.tryCatchAsync(inputFunction);
            const action = actualChain
                .handle([Exception], higherLevelExceptionFactory)
                .handle(
                    [HigherLevelException],
                    () => new Exception('Should not have hit this mapping')
                )
                .execute();
            await expect(action).rejects.toThrowException(expectedException);

            verify(
                mockedExceptionActionBroker.addAction(
                    HigherLevelException,
                    anyFunction()
                )
            ).once();
            verify(
                mockedExceptionActionBroker.addAction(Exception, anyFunction())
            ).once();
            verify(mockedExceptionActionBroker.getAction(Exception)).once();
        });
    });
});
