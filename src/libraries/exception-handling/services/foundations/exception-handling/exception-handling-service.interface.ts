import { AsyncFunction } from '../../../models/exception-handling/async-function';
import { ExceptionHandlingChainActions } from '../../../models/exception-handling/exception-handling-chain-actions';
import { ExceptionHandlingChainActionsAsync } from '../../../models/exception-handling/exception-handling-chain-actions-async';
import { Function } from '../../../models/exception-handling/function';

export interface IExceptionHandlingService<T> {
    tryCatch(func: Function<T>): ExceptionHandlingChainActions<T>;

    tryCatchAsync(
        func: AsyncFunction<T>
    ): ExceptionHandlingChainActionsAsync<T>;
}
