import { ExceptionHandlingClient } from './clients/exception-handling/exception-handling-client';
import { AsyncFunction } from './models/exception-handling/async-function';
import { Function } from './models/exception-handling/function';

export function tryCatch<T>(func: Function<T>) {
    return ExceptionHandlingClient.tryCatch(func);
}

export function tryCatchAsync<T>(func: AsyncFunction<T>) {
    return ExceptionHandlingClient.tryCatchAsync(func);
}
