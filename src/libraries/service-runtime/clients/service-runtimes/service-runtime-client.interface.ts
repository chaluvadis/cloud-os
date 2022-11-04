import { Executable } from '../../models/executable/executable';
import { ServiceRuntimeChain } from '../../models/service-runtime-chains/service-runtime-chain';

export interface IServiceRuntimeClient {
    createRuntime<T>(executable: Executable<T>): ServiceRuntimeChain<T>;

    createAsyncRuntime<T>(
        executable: Executable<Promise<T>>
    ): ServiceRuntimeChain<Promise<T>>;
}
