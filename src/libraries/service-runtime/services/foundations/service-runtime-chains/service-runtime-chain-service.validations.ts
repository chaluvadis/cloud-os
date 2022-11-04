import { isNil } from '../../../../conditions';
import { ExceptionHandlerExecutor } from '../../../models/exception-handlers/exception-handler-executor';
import { NullExceptionHandlerExecutorException } from '../../../models/exception-handlers/exceptions/null-exception-handler-executor-exception';
import { NullExecutableException } from '../../../models/executable/exceptions/null-executable-exception';
import { Executable } from '../../../models/executable/executable';

export class ServiceRuntimeChainServiceValidations {
    validateExecutable<T>(executable: Executable<T>) {
        if (isNil(executable)) {
            throw new NullExecutableException();
        }
    }

    validateExceptionHandlerExecutor<T>(executor: ExceptionHandlerExecutor<T>) {
        if (isNil(executor)) {
            throw new NullExceptionHandlerExecutorException();
        }
    }
}
