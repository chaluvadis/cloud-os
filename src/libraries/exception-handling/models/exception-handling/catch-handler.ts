import { ExceptionConstructor } from '../../../exceptions/exception-constructor';
import { ExceptionAction } from './exception-action';
import { ExceptionHandlingChainActions } from './exception-handling-chain-actions';

export type CatchHandler<T> = (
    exceptionPatterns: ExceptionConstructor[],
    action: ExceptionAction
) => ExceptionHandlingChainActions<T>;
