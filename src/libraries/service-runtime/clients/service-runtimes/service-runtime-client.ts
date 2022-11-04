import { Executable } from '../../models/executable/executable';
import { ServiceRuntimeChain } from '../../models/service-runtime-chains/service-runtime-chain';
import { ServiceRuntimeChainService } from '../../services/foundations/service-runtime-chains/service-runtime-chain-service';
import { IServiceRuntimeClient } from './service-runtime-client.interface';

export class ServiceRuntimeClient implements IServiceRuntimeClient {
    private readonly runtimeChainService: ServiceRuntimeChainService;

    constructor() {
        this.runtimeChainService = new ServiceRuntimeChainService();
    }

    createRuntime<T>(executable: Executable<T>): ServiceRuntimeChain<T> {
        return this.runtimeChainService.createServiceRuntimeChain(executable);
    }

    createAsyncRuntime<T>(
        executable: Executable<Promise<T>>
    ): ServiceRuntimeChain<Promise<T>> {
        return this.runtimeChainService.createAsyncServiceRuntimeChain(
            executable
        );
    }
}
