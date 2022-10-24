import { Executable } from '../executable/executable';
import { ServiceRuntimeChain } from '../service-runtime-chains/service-runtime-chain';

export type Exceptionhandlers<T> = (
    executable: Executable<T>
) => ServiceRuntimeChain<T>;
