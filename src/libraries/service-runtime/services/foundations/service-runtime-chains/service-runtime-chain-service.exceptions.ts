import { tryCatch } from '../../../../exception-handling';
import { NullExceptionHandlerExecutorException } from '../../../models/exception-handlers/exceptions/null-exception-handler-executor-exception';
import { NullExecutableException } from '../../../models/executable/exceptions/null-executable-exception';
import { Executable } from '../../../models/executable/executable';
import { ServiceRuntimeChainValidationException } from './exceptions/service-runtime-chain-validation-exception';

export class ServiceRuntimeChainServiceExceptions {
    createServiceRuntimeChainHandler<T>(executable: Executable<T>) {
        return tryCatch(executable)
            .handle(
                [
                    NullExecutableException,
                    NullExceptionHandlerExecutorException,
                ],
                (exception) =>
                    new ServiceRuntimeChainValidationException(exception)
            )
            .execute();
    }
}
