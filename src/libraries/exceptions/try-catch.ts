import { AsyncFunction } from './async-function';
import { CatchHandler } from './catch-handler';
import { Exception } from './exception';
import { ExceptionConstructor } from './exception-constructor';

export function tryCatch<T>(func: () => T, catchHandler: CatchHandler): T {
    try {
        return func();
    } catch (error) {
        handleError(error, catchHandler);
        throw new Error(
            'Should not reach here. Check the handleError function for cases that are not handled.'
        );
    }
}

function handleError(error: any, catchHandler: CatchHandler) {
    if (error instanceof Exception) {
        throw catchHandler(error, error.constructor as ExceptionConstructor);
    } else if (error instanceof Error) {
        throw catchHandler(new Exception(error.message, error), Exception);
    } else if (error instanceof Symbol) {
        throw catchHandler(new Exception(error.toString()), Exception);
    } else if (typeof error === 'string') {
        throw catchHandler(new Exception(error), Exception);
    } else {
        throw catchHandler(new Exception(String(error)), Exception);
    }
}

export async function tryCatchAsync<T>(
    func: AsyncFunction<T>,
    catchHandler: CatchHandler
): Promise<T> {
    try {
        return await func();
    } catch (error) {
        handleError(error, catchHandler);
        throw new Error(
            'Should not reach here. Check the handleError function for cases that are not handled.'
        );
    }
}
