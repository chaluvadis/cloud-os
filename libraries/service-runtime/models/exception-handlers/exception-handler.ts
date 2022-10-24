import { ServiceRuntimeChain } from '../service-runtime-chains/service-runtime-chain';
import { ExceptionHandlerExecutor } from './exception-handler-executor';

export type ExceptionHandler<T> = (
    executable: ExceptionHandlerExecutor<T>
) => ServiceRuntimeChain<T>;
