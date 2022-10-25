import { Executable } from '../models/executable/executable';
import { ServiceRuntimeChain } from '../models/service-runtime-chains/service-runtime-chain';
import { ServiceRuntimeChainService } from '../services/foundations/service-runtime-chains/service-runtime-chain-service';

export class ServiceRuntimeClient {
    private readonly runtimeChainService: ServiceRuntimeChainService;

    constructor() {
        this.runtimeChainService = new ServiceRuntimeChainService();
    }

    createFunctionRuntime<T>(
        executable: Executable<T>
    ): ServiceRuntimeChain<T> {
        return this.runtimeChainService.createServiceRuntimeChain(executable);
    }

    createAsyncFunctionRuntime<T>(
        executable: Executable<Promise<T>>
    ): ServiceRuntimeChain<Promise<T>> {
        return this.runtimeChainService.createAsyncServiceRuntimeChain(
            executable
        );
    }
}
