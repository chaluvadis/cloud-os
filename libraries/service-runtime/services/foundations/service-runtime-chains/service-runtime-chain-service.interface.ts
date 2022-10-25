import { Executable } from '../../../models/executable/executable';
import { ServiceRuntimeChain } from '../../../models/service-runtime-chains/service-runtime-chain';

export interface IServiceRuntimeChainService {
    createServiceRuntimeChain<T>(
        executable: Executable<T>
    ): ServiceRuntimeChain<T>;

    createAsyncServiceRuntimeChain<T>(
        executable: Executable<Promise<T>>
    ): ServiceRuntimeChain<Promise<T>>;
}
