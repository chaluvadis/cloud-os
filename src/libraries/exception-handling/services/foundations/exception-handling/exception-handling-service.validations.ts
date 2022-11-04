import { isNil } from '../../../../conditions';
import { AsyncFunction } from '../../../models/exception-handling/async-function';
import { ErrorConstructor } from '../../../models/exception-handling/error-constructor';
import { ExceptionAction } from '../../../models/exception-handling/exception-action';
import { NullExceptionActionException } from '../../../models/exception-handling/exceptions/null-exception-action-exception';
import { NullExceptionPatternList } from '../../../models/exception-handling/exceptions/null-exception-pattern-list';
import { NullFunctionException } from '../../../models/exception-handling/exceptions/null-function-exception';
import { Function } from '../../../models/exception-handling/function';

export class ExceptionHandlingServiceValidations<T> {
    validateFunction(func: Function<T> | AsyncFunction<T>) {
        if (isNil(func)) {
            throw new NullFunctionException();
        }
    }

    validateErrorPatterns(errorPatternList: ErrorConstructor[]) {
        if (isNil(errorPatternList)) {
            throw new NullExceptionPatternList();
        }
    }

    validateExceptionAction(action: ExceptionAction) {
        if (isNil(action)) {
            throw new NullExceptionActionException();
        }
    }
}
