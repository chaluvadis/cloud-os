import { Exception } from '../../../../exceptions';
import { ExceptionConstructor } from '../../../../exceptions';
import { NullExceptionActionException } from '../../../models/exception-handling/exceptions/null-exception-action-exception';
import { NullExceptionPatternList } from '../../../models/exception-handling/exceptions/null-exception-pattern-list';
import { NullFunctionException } from '../../../models/exception-handling/exceptions/null-function-exception';
import { Function } from '../../../models/exception-handling/function';
import { ExceptionHandlingServiceException } from './exceptions/exception-handling-service-exception';
import { ExceptionHandlingValidationException } from './exceptions/exception-handling-validation-exception';
import { FailedExceptionActionStorageException } from './exceptions/failed-exception-action-storage-exception';

export class ExceptionHandlingServiceExceptions {
    tryCatch<T>(func: Function<T>) {
        try {
            return func();
        } catch (error) {
            const exception = Exception.fromError(error);
            const exceptionConstructor =
                exception.constructor as ExceptionConstructor;
            switch (exceptionConstructor) {
                case NullFunctionException:
                    throw new ExceptionHandlingValidationException(exception);
                default:
                    throw this.createDefaultServiceException(exception);
            }
        }
    }

    private createDefaultServiceException(exception: Exception) {
        const failedException = new FailedExceptionActionStorageException(
            exception
        );
        throw new ExceptionHandlingServiceException(failedException);
    }

    handleCatch<T>(func: Function<T>) {
        try {
            return func();
        } catch (error) {
            const exception = Exception.fromError(error);
            const exceptionConstructor =
                exception.constructor as ExceptionConstructor;
            switch (exceptionConstructor) {
                case NullExceptionPatternList:
                case NullExceptionActionException:
                    throw new ExceptionHandlingValidationException(exception);
                default:
                    throw this.createDefaultServiceException(exception);
            }
        }
    }

    wrapExceptions<T>(func: Function<T>) {
        try {
            return func();
        } catch (error) {
            const exception = Exception.fromError(error);
            throw this.createDefaultServiceException(exception);
        }
    }
}
