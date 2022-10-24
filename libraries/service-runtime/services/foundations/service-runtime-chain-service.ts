import { Executable } from "../../models/executable/executable";
import { ServiceRuntimeChain } from "../../models/service-runtime-chains/service-runtime-chain";

export class ServiceRuntimeChainService {
    createFunctionRuntime<T>(
        executable: Executable<T>
    ): ServiceRuntimeChain<T> {
        throw new Error();
    }

    createAsyncFunctionRuntime<T>(
        executable: Executable<Promise<T>>
    ): ServiceRuntimeChain<Promise<T>> {
        throw new Error();
    }
}
