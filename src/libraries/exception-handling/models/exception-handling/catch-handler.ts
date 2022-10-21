import { ExceptionConstructor } from '../../../exceptions';
import { ExceptionAction } from './exception-action';
import { ExceptionHandlingChainActions } from './exception-handling-chain-actions';

export type CatchHandler<T> = (
    exceptionPatterns: ExceptionConstructor[],
    action: ExceptionAction
) => ExceptionHandlingChainActions<T>;
