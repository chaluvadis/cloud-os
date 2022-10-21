import { isNil } from '../../../../conditions/is-nil';
import { ExceptionConstructor } from '../../../../exceptions/exception-constructor';
import { AsyncFunction } from '../../../models/exception-handling/async-function';
import { ExceptionAction } from '../../../models/exception-handling/exception-action';
import { NullExceptionActionException } from '../../../models/exception-handling/exceptions/null-exception-action-exception';
import { NullExceptionPatternList } from '../../../models/exception-handling/exceptions/null-exception-pattern-list';
import { NullFunctionException } from '../../../models/exception-handling/exceptions/null-function-exception';
import { Function } from '../../../models/exception-handling/function';
import { ExceptionHandlingValidationException } from './exceptions/exception-handling-validation-exception';

export class ExceptionHandlingServiceValidations<T> {
    validateFunction(func: Function<T> | AsyncFunction<T>) {
        if (isNil(func)) {
            const nullException = new NullFunctionException();
            throw new ExceptionHandlingValidationException(nullException);
        }
    }

    validateExceptionPatterns(exceptionPatternList: ExceptionConstructor[]) {
        if (isNil(exceptionPatternList)) {
            const nullException = new NullExceptionPatternList();
            throw new ExceptionHandlingValidationException(nullException);
        }
    }

    validateExceptionAction(action: ExceptionAction) {
        if (isNil(action)) {
            throw new ExceptionHandlingValidationException(
                new NullExceptionActionException()
            );
        }
    }
}
