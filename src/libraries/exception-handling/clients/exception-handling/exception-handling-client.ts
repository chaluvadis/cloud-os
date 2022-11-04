import { ExceptionActionBroker } from '../../brokers/exception-actions/exception-action-broker';
import { AsyncFunction } from '../../models/exception-handling/async-function';
import { ExceptionHandlingChainActions } from '../../models/exception-handling/exception-handling-chain-actions';
import { AsyncExceptionHandlingChainActions } from '../../models/exception-handling/async-exception-handling-chain-actions';
import { Function } from '../../models/exception-handling/function';
import { ExceptionHandlingService } from '../../services/foundations/exception-handling/exception-handling-service';
import { IExceptionHandlingClient } from './exception-handling-client.interface';

export class ExceptionHandlingClient<T> implements IExceptionHandlingClient<T> {
    private readonly service: ExceptionHandlingService<T>;

    constructor() {
        this.service = new ExceptionHandlingService<T>(
            new ExceptionActionBroker()
        );
    }

    tryCatch(func: Function<T>): ExceptionHandlingChainActions<T> {
        return this.service.tryCatch(func);
    }

    tryCatchAsync(
        func: AsyncFunction<T>
    ): AsyncExceptionHandlingChainActions<T> {
        return this.service.tryCatchAsync(func);
    }
}
