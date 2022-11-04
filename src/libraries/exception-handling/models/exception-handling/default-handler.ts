import { ExceptionAction } from './exception-action';
import { ExceptionHandlingChainActions } from './exception-handling-chain-actions';

export type DefaultHandler<T> = (
    action: ExceptionAction
) => ExceptionHandlingChainActions<T>;
