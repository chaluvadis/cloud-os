import { ExceptionActionBroker } from '../../brokers/exception-actions/exception-action-broker';
import { AsyncFunction } from '../../models/exception-handling/async-function';
import { Function } from '../../models/exception-handling/function';
import { ExceptionHandlingService } from '../../services/foundations/exception-handling/exception-handling-service';

export function tryCatch<T>(func: Function<T>) {
    const service = new ExceptionHandlingService(new ExceptionActionBroker());

    return service.tryCatch(func);
}

export function tryCatchAsync<T>(func: AsyncFunction<T>) {
    const service = new ExceptionHandlingService(new ExceptionActionBroker());

    return service.tryCatchAsync(func);
}
