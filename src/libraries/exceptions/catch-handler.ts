import { Exception } from './exception';
import { ExceptionConstructor } from './exception-constructor';

export type CatchHandler = (
    exception: Exception,
    exceptionType: ExceptionConstructor
) => Exception;
