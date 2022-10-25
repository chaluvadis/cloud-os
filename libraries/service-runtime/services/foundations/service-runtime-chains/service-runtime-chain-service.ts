import { ExceptionHandlerExecutor } from '../../../models/exception-handlers/exception-handler-executor';
import { Executable } from '../../../models/executable/executable';
import { ServiceRuntimeChain } from '../../../models/service-runtime-chains/service-runtime-chain';
import { IServiceRuntimeChainService } from './service-runtime-chain-service.interface';

export class ServiceRuntimeChainService implements IServiceRuntimeChainService {
    createServiceRuntimeChain<T>(
        executable: Executable<T>
    ): ServiceRuntimeChain<T> {
        return this.instantiateServiceRuntimeChain(executable);
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
        exceptionHandler: ExceptionHandlerExecutor<T>,
        executable: Executable<T>
    ): ServiceRuntimeChain<T> {
        return this.instantiateServiceRuntimeChain(() =>
            exceptionHandler(executable)
        );
    }

    createAsyncServiceRuntimeChain<T>(
        executable: Executable<Promise<T>>
    ): ServiceRuntimeChain<Promise<T>> {
        throw new Error();
    }
}
