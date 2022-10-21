import { ExceptionActionBroker } from '../../brokers/exception-actions/exception-action-broker';
import { AsyncFunction } from '../../models/exception-handling/async-function';
import { ExceptionHandlingChainActions } from '../../models/exception-handling/exception-handling-chain-actions';
import { Function } from '../../models/exception-handling/function';
import { ExceptionHandlingService } from '../../services/foundations/exception-handling/exception-handling-service';

export function tryCatch<T>(
    func: Function<T>
): ExceptionHandlingChainActions<T> {
    const service = new ExceptionHandlingService<T>(
        new ExceptionActionBroker()
    );

    return service.tryCatch(func);
}

export function tryCatchAsync<T>(
    func: AsyncFunction<T>
): ExceptionHandlingChainActions<Promise<T>> {
    const service = new ExceptionHandlingService<T>(
        new ExceptionActionBroker()
    );

    return service.tryCatchAsync(func);
}
