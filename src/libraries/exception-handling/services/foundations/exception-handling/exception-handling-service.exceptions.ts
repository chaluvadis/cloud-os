import { Exception } from '../../../../exceptions/exception';
import { Function } from '../../../models/exception-handling/function';
import { ExceptionHandlingDependencyException } from './exceptions/exception-handling-dependency-exception';
import { FailedExceptionActionStorageException } from './exceptions/failed-exception-action-storage-exception';

export class ExceptionHandlingServiceExceptions {
    tryCatch<T>(func: Function<T>) {
        try {
            return func();
        } catch (error) {
            const innerException = Exception.fromError(error);
            const failedException = new FailedExceptionActionStorageException(
                innerException
            );
            throw new ExceptionHandlingDependencyException(failedException);
        }
    }
}
