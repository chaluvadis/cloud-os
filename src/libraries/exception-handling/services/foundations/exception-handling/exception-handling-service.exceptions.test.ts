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
import { ExceptionHandlingServiceException } from './exceptions-handling-service-exception';
import { FailedExceptionActionStorageException } from './exceptions/failed-exception-action-storage-exception';

describe('Exception Handling Service Exceptions Test Suite', () => {
    const mockedExceptionActionBroker = mock(ExceptionActionBroker);
    const service = new ExceptionHandlingService(
        instance(mockedExceptionActionBroker)
    );

    beforeEach(() => {
        reset(mockedExceptionActionBroker);
    });

    describe('tryCatch', () => {
        test('Should throw a service exception when adding an action throws an exception', () => {
            const inputFunction = () => {};
            const innerError = new Error('Failed to add action');
            const innerException = new Exception(
                innerError.message,
                innerError
            );
            const failedException = new FailedExceptionActionStorageException(
                innerException
            );
            const defaultAction = () => new Exception();
            const expectedException = new ExceptionHandlingServiceException(
                failedException
            );
            when(
                mockedExceptionActionBroker.addAction(Exception, anyFunction())
            ).thenThrow(innerError);

            const action = () =>
                service
                    .tryCatch(inputFunction)
                    .handle([Exception], defaultAction);
            expect(action).toThrowException(expectedException);

            verify(
                mockedExceptionActionBroker.addAction(anything(), anyFunction())
            ).once();
        });

        test('Should throw a service exception when getting an action throws an exception', () => {
            const inputFunction = () => {
                throw new Error();
            };
            const innerError = new Error('Failed to get action');
            const innerException = new Exception(
                innerError.message,
                innerError
            );
            const failedException = new FailedExceptionActionStorageException(
                innerException
            );
            const expectedException = new ExceptionHandlingServiceException(
                failedException
            );
            when(mockedExceptionActionBroker.getAction(Exception)).thenThrow(
                innerError
            );

            const action = () => service.tryCatch(inputFunction).execute();
            expect(action).toThrowException(expectedException);

            verify(mockedExceptionActionBroker.getAction(anything())).once();
        });
    });

    describe('tryCatchAsync', () => {
        test('Should throw a service exception when adding an action throws an exception', async () => {
            const inputFunction = async () => {};
            const innerError = new Error('Failed to add action');
            const innerException = new Exception(
                innerError.message,
                innerError
            );
            const failedException = new FailedExceptionActionStorageException(
                innerException
            );
            const defaultAction = () => new Exception();
            const expectedException = new ExceptionHandlingServiceException(
                failedException
            );
            when(
                mockedExceptionActionBroker.addAction(Exception, anyFunction())
            ).thenThrow(innerError);

            const action = () =>
                service
                    .tryCatchAsync(inputFunction)
                    .handle([Exception], defaultAction);
            expect(action).toThrowException(expectedException);

            verify(
                mockedExceptionActionBroker.addAction(anything(), anyFunction())
            ).once();
        });

        test('Should throw a service exception when getting an action throws an exception', async () => {
            const inputFunction = async () => {
                throw new Error();
            };
            const innerError = new Error('Failed to get action');
            const innerException = new Exception(
                innerError.message,
                innerError
            );
            const failedException = new FailedExceptionActionStorageException(
                innerException
            );
            const expectedException = new ExceptionHandlingServiceException(
                failedException
            );
            when(mockedExceptionActionBroker.getAction(Exception)).thenThrow(
                innerError
            );

            const action = service.tryCatchAsync(inputFunction).execute();
            await expect(action).rejects.toThrowException(expectedException);

            verify(mockedExceptionActionBroker.getAction(anything())).once();
        });
    });
});
