import { AsyncFunction } from '../../models/exception-handling/async-function';
import { ExceptionHandlingChainActions } from '../../models/exception-handling/exception-handling-chain-actions';
import { AsyncExceptionHandlingChainActions } from '../../models/exception-handling/async-exception-handling-chain-actions';
import { Function } from '../../models/exception-handling/function';

export interface IExceptionHandlingClient<T> {
    tryCatch(func: Function<T>): ExceptionHandlingChainActions<T>;

    tryCatchAsync(
        func: AsyncFunction<T>
    ): AsyncExceptionHandlingChainActions<T>;
}
