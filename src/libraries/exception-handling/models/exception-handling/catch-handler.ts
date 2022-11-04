import { ErrorConstructor } from './error-constructor';
import { ExceptionAction } from './exception-action';
import { ExceptionHandlingChainActions } from './exception-handling-chain-actions';

export type CatchHandler<T> = (
    exceptionPatterns: ErrorConstructor[],
    action: ExceptionAction
) => ExceptionHandlingChainActions<T>;
