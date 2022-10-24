import { ExceptionActionBroker } from '../../brokers/exception-actions/exception-action-broker';
import { AsyncFunction } from '../../models/exception-handling/async-function';
import { ExceptionHandlingChainActions } from '../../models/exception-handling/exception-handling-chain-actions';
import { ExceptionHandlingChainActionsAsync } from '../../models/exception-handling/exception-handling-chain-actions-async';
import { Function } from '../../models/exception-handling/function';
import { ExceptionHandlingService } from '../../services/foundations/exception-handling/exception-handling-service';

export class ExceptionHandlingClient {
    static tryCatch<T>(func: Function<T>): ExceptionHandlingChainActions<T> {
        const service = new ExceptionHandlingService<T>(
            new ExceptionActionBroker()
        );

        return service.tryCatch(func);
    }

    static tryCatchAsync<T>(
        func: AsyncFunction<T>
    ): ExceptionHandlingChainActionsAsync<T> {
        const service = new ExceptionHandlingService<T>(
            new ExceptionActionBroker()
        );

        return service.tryCatchAsync(func);
    }
}
