import { NullExceptionHandlerExecutorException } from '../../../models/exception-handlers/exceptions/null-exception-handler-executor-exception';
import { NullExecutableException } from '../../../models/executable/exceptions/null-executable-exception';
import { ServiceRuntimeChainValidationException } from './exceptions/service-runtime-chain-validation-exception';
import { ServiceRuntimeChainService } from './service-runtime-chain-service';

describe('Service Runtime Chain Service Validations Test Suite', () => {
    const service = new ServiceRuntimeChainService();

    describe('createServiceRuntimeChain', () => {
        test('Should throw a validation exception when the executable is null', () => {
            const nullException = new NullExecutableException();
            const expectedException =
                new ServiceRuntimeChainValidationException(nullException);
            const executable = null as any;

            const action = () => service.createServiceRuntimeChain(executable);
            expect(action).toThrowException(expectedException);
        });

        test('Should throw a validation exception when the exceptionHandler is null', () => {
            const nullException = new NullExceptionHandlerExecutorException();
            const expectedException =
                new ServiceRuntimeChainValidationException(nullException);
            const executable = () => {};
            const exceptionHandler = null as any;

            const action = () =>
                service
                    .createServiceRuntimeChain(executable)
                    .exceptionHandler(exceptionHandler);
            expect(action).toThrowException(expectedException);
        });
    });

    describe('createAsyncServiceRuntimeChain', () => {
        test('Should throw a validation exception when the executable is null', () => {
            const nullException = new NullExecutableException();
            const expectedException =
                new ServiceRuntimeChainValidationException(nullException);
            const executable = null as any;

            const action = () =>
                service.createAsyncServiceRuntimeChain(executable);
            expect(action).toThrowException(expectedException);
        });

        test('Should throw a validation exception when the exceptionHandler is null', () => {
            const nullException = new NullExceptionHandlerExecutorException();
            const expectedException =
                new ServiceRuntimeChainValidationException(nullException);
            const executable = () => Promise.resolve();
            const exceptionHandler = null as any;

            const action = () =>
                service
                    .createAsyncServiceRuntimeChain(executable)
                    .exceptionHandler(exceptionHandler);
            expect(action).toThrowException(expectedException);
        });
    });
});
