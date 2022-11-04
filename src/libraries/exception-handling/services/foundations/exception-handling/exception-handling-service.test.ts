import {
    anyFunction,
    anything,
    instance,
    mock,
    reset,
    verify,
    when,
} from 'ts-mockito';
import { Exception } from '../../../../exceptions';
import { ExceptionActionBroker } from '../../../brokers/exception-actions/exception-action-broker';
import { ExceptionHandlingService } from './exception-handling-service';

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
            expect(() => actualChain.execute()).toThrowException(
                expectedException
            );

            verify(mockedExceptionActionBroker.getAction(Exception)).once();
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

        test('Should correctly create an exception when the default handler is called', () => {
            const innerException = new Exception();
            const inputFunction = () => {
                throw innerException;
            };
            const higherLevelExceptionFactory = (exception: Exception) =>
                new HigherLevelException(exception);
            const expectedException = new HigherLevelException(innerException);
            when(mockedExceptionActionBroker.getDefault()).thenReturn(
                higherLevelExceptionFactory
            );

            const action = () =>
                service
                    .tryCatch(inputFunction)
                    .handle([HigherLevelException], (exception) => exception)
                    .catchAll(
                        (exception) => new HigherLevelException(exception)
                    )
                    .execute();
            expect(action).toThrowException(expectedException);

            verify(
                mockedExceptionActionBroker.setDefault(anyFunction())
            ).once();
        });

        test('Should correctly create an exception when handle is called with once', () => {
            const innerException = new Exception();
            const inputFunction = () => {
                throw innerException;
            };
            const higherLevelExceptionFactory = (exception: Exception) =>
                new HigherLevelException(exception);
            const expectedException = new HigherLevelException(innerException);
            when(mockedExceptionActionBroker.getAction(Exception)).thenReturn(
                higherLevelExceptionFactory
            );

            const action = () =>
                service
                    .tryCatch(inputFunction)
                    .handle(
                        [Exception, HigherLevelException],
                        higherLevelExceptionFactory
                    )
                    .execute();
            expect(action).toThrowException(expectedException);

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

        test('Should correctly create exception when handle is called multiple times', () => {
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
            const action = () => actualChain.execute();
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(mockedExceptionActionBroker.getAction(anything())).once();
        });

        test('Should correctly create an exception when handle is called with once', async () => {
            const innerException = new Exception();
            const inputFunction = async () => {
                throw innerException;
            };
            const higherLevelExceptionFactory = (exception: Exception) =>
                new HigherLevelException(exception);
            const expectedException = new HigherLevelException(innerException);
            when(mockedExceptionActionBroker.getAction(Exception)).thenReturn(
                higherLevelExceptionFactory
            );

            const action = async () =>
                service
                    .tryCatchAsync(inputFunction)
                    .handle(
                        [Exception, HigherLevelException],
                        higherLevelExceptionFactory
                    )
                    .execute();
            await expect(action).toThrowExceptionAsync(expectedException);

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

        test('Should correctly create exception when handle is called multiple times', async () => {
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
            const action = async () =>
                actualChain
                    .handle([Exception], higherLevelExceptionFactory)
                    .handle(
                        [HigherLevelException],
                        () => new Exception('Should not have hit this mapping')
                    )
                    .execute();
            await expect(action).toThrowExceptionAsync(expectedException);

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

        test('Should correctly create an exception when the default handler is called', async () => {
            const innerException = new Exception();
            const inputFunction = async () => {
                throw innerException;
            };
            const higherLevelExceptionFactory = (exception: Exception) =>
                new HigherLevelException(exception);
            const expectedException = new HigherLevelException(innerException);
            when(mockedExceptionActionBroker.getDefault()).thenReturn(
                higherLevelExceptionFactory
            );

            const action = () =>
                service
                    .tryCatchAsync(inputFunction)
                    .handle([HigherLevelException], (exception) => exception)
                    .catchAll(
                        (exception) => new HigherLevelException(exception)
                    )
                    .execute();
            await expect(action).toThrowExceptionAsync(expectedException);

            verify(
                mockedExceptionActionBroker.setDefault(anyFunction())
            ).once();
        });
    });
});
