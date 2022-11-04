import { ExceptionHandlingClient } from './clients/exception-handling/exception-handling-client';
import { AsyncFunction } from './models/exception-handling/async-function';
import { Function } from './models/exception-handling/function';

export function tryCatch<T>(func: Function<T>) {
    const client = new ExceptionHandlingClient<T>();
    return client.tryCatch(func);
}

export function tryCatchAsync<T>(func: AsyncFunction<T>) {
    const client = new ExceptionHandlingClient<T>();
    return client.tryCatchAsync(func);
}
