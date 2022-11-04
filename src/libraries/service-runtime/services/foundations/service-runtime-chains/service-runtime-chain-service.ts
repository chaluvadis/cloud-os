import { ExceptionHandlerExecutor } from '../../../models/exception-handlers/exception-handler-executor';
import { Executable } from '../../../models/executable/executable';
import { ServiceRuntimeChain } from '../../../models/service-runtime-chains/service-runtime-chain';
import { ServiceRuntimeChainServiceExceptions } from './service-runtime-chain-service.exceptions';
import { IServiceRuntimeChainService } from './service-runtime-chain-service.interface';
import { ServiceRuntimeChainServiceValidations } from './service-runtime-chain-service.validations';

export class ServiceRuntimeChainService implements IServiceRuntimeChainService {
    private readonly validations: ServiceRuntimeChainServiceValidations;
    private readonly exceptions: ServiceRuntimeChainServiceExceptions;

    constructor() {
        this.validations = new ServiceRuntimeChainServiceValidations();
        this.exceptions = new ServiceRuntimeChainServiceExceptions();
    }

    createServiceRuntimeChain<T>(
        executable: Executable<T>
    ): ServiceRuntimeChain<T> {
        return this.exceptions.createServiceRuntimeChainHandler(() => {
            this.validations.validateExecutable(executable);
            return this.instantiateServiceRuntimeChain(executable);
        });
    }

    private instantiateServiceRuntimeChain<T>(executable: Executable<T>) {
        return new ServiceRuntimeChain<T>(
            () => this.execute(executable),
            (exceptionHandler) =>
                this.exceptionHandler(exceptionHandler, executable)
        );
    }

    private execute<T>(executable: Executable<T>): T {
        return executable();
    }

    private exceptionHandler<T>(
        executor: ExceptionHandlerExecutor<T>,
        executable: Executable<T>
    ): ServiceRuntimeChain<T> {
        return this.exceptions.createServiceRuntimeChainHandler(() => {
            this.validations.validateExceptionHandlerExecutor(executor);
            return this.instantiateServiceRuntimeChain(() =>
                executor(executable)
            );
        });
    }

    createAsyncServiceRuntimeChain<T>(
        executable: Executable<Promise<T>>
    ): ServiceRuntimeChain<Promise<T>> {
        return this.exceptions.createServiceRuntimeChainHandler(() => {
            this.validations.validateExecutable(executable);
            return this.instantiateAsyncServiceRuntimeChain(executable);
        });
    }

    private instantiateAsyncServiceRuntimeChain<T>(
        executable: Executable<Promise<T>>
    ) {
        return new ServiceRuntimeChain<Promise<T>>(
            () => this.executeAsync(executable),
            (exceptionHandler) =>
                this.exceptionHandlerAsync(exceptionHandler, executable)
        );
    }

    private async executeAsync<T>(
        executable: Executable<Promise<T>>
    ): Promise<T> {
        return await executable();
    }

    private exceptionHandlerAsync<T>(
        executor: ExceptionHandlerExecutor<Promise<T>>,
        executable: Executable<Promise<T>>
    ): ServiceRuntimeChain<Promise<T>> {
        return this.exceptions.createServiceRuntimeChainHandler(() => {
            this.validations.validateExceptionHandlerExecutor(executor);
            return this.instantiateServiceRuntimeChain(() =>
                executor(executable)
            );
        });
    }
}
