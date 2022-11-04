import { isNil } from '../../../../conditions';
import { Exception } from '../../../../exceptions';
import { ExceptionActionBroker } from '../../../brokers/exception-actions/exception-action-broker';
import { AsyncFunction } from '../../../models/exception-handling/async-function';
import { ErrorConstructor } from '../../../models/exception-handling/error-constructor';
import { ExceptionAction } from '../../../models/exception-handling/exception-action';
import { ExceptionHandlingChainActions } from '../../../models/exception-handling/exception-handling-chain-actions';
import { AsyncExceptionHandlingChainActions } from '../../../models/exception-handling/async-exception-handling-chain-actions';
import { Function } from '../../../models/exception-handling/function';
import { ExceptionHandlingServiceExceptions } from './exception-handling-service.exceptions';
import { IExceptionHandlingService } from './exception-handling-service.interface';
import { ExceptionHandlingServiceValidations } from './exception-handling-service.validations';

export class ExceptionHandlingService<T>
    implements IExceptionHandlingService<T>
{
    private readonly exceptions: ExceptionHandlingServiceExceptions;
    private readonly validations: ExceptionHandlingServiceValidations<T>;

    constructor(private readonly broker: ExceptionActionBroker) {
        this.exceptions = new ExceptionHandlingServiceExceptions();
        this.validations = new ExceptionHandlingServiceValidations();
    }

    tryCatch(func: Function<T>): ExceptionHandlingChainActions<T> {
        return this.exceptions.tryCatch(() => {
            this.validations.validateFunction(func);
            return this.createExceptionHandlingChainActions(func);
        });
    }

    private createExceptionHandlingChainActions(
        func: Function<T>
    ): ExceptionHandlingChainActions<T> {
        return new ExceptionHandlingChainActions<T>(
            (exceptionPatterns, action) =>
                this.handleCatch(exceptionPatterns, action, func),
            () => this.execute(func),
            (action) => this.handleDefault(action, func)
        );
    }

    private handleCatch(
        exceptionPatternList: ErrorConstructor[],
        action: ExceptionAction,
        func: Function<T>
    ): ExceptionHandlingChainActions<T> {
        return this.exceptions.handleCatch(() => {
            this.addExceptionPatterns(exceptionPatternList, action);
            return this.createExceptionHandlingChainActions(func);
        });
    }

    private addExceptionPatterns(
        exceptionPatternList: ErrorConstructor[],
        exceptionAction: ExceptionAction
    ) {
        this.validations.validateErrorPatterns(exceptionPatternList);
        this.validations.validateExceptionAction(exceptionAction);
        exceptionPatternList.forEach((exceptionConstructor) => {
            this.broker.addAction(exceptionConstructor, exceptionAction);
        });
    }

    private execute(func: Function<T>) {
        try {
            return func();
        } catch (error) {
            throw this.wrapException(this.createNativeErrorFromAnything(error));
        }
    }

    private createNativeErrorFromAnything(error: unknown) {
        if (error instanceof Error) {
            return error;
        } else if (typeof error === 'symbol') {
            return new Error(error.toString());
        } else if (typeof error === 'string') {
            return new Error(error);
        } else {
            return new Error(String(error));
        }
    }

    private wrapException(error: Error) {
        return this.exceptions.wrapExceptions(() => {
            const errorConstructor = error.constructor as ErrorConstructor;
            const action = this.broker.getAction(errorConstructor);
            const defaultHandler = this.broker.getDefault();
            const exception = Exception.fromError(error);
            if (!isNil(action)) {
                return action(exception);
            }
            if (!isNil(defaultHandler)) {
                return defaultHandler(exception);
            }
            return exception;
        });
    }

    private handleDefault(action: ExceptionAction, func: Function<T>) {
        return this.exceptions.handleDefault(() => {
            this.validations.validateExceptionAction(action);
            this.broker.setDefault(action);
            return this.createExceptionHandlingChainActions(func);
        });
    }

    tryCatchAsync(
        func: AsyncFunction<T>
    ): AsyncExceptionHandlingChainActions<T> {
        return this.exceptions.tryCatch(() => {
            this.validations.validateFunction(func);
            return this.createAsyncExceptionHandlingChainActions(func);
        });
    }

    private createAsyncExceptionHandlingChainActions(
        func: AsyncFunction<T>
    ): AsyncExceptionHandlingChainActions<T> {
        return new AsyncExceptionHandlingChainActions<T>(
            (exceptionPatterns, action) =>
                this.handleAsyncCatch(exceptionPatterns, action, func),
            () => this.asyncExecute(func),
            (action) => this.handleAsyncDefault(action, func)
        );
    }

    private handleAsyncCatch(
        exceptionPatternList: ErrorConstructor[],
        action: ExceptionAction,
        func: AsyncFunction<T>
    ): AsyncExceptionHandlingChainActions<T> {
        return this.exceptions.handleCatch(() => {
            this.addExceptionPatterns(exceptionPatternList, action);
            return this.createAsyncExceptionHandlingChainActions(func);
        });
    }

    private async asyncExecute(func: AsyncFunction<T>): Promise<T> {
        try {
            return await func();
        } catch (error) {
            throw this.wrapException(this.createNativeErrorFromAnything(error));
        }
    }

    private handleAsyncDefault(
        action: ExceptionAction,
        func: AsyncFunction<T>
    ): AsyncExceptionHandlingChainActions<T> {
        return this.exceptions.handleDefault(() => {
            this.validations.validateExceptionAction(action);
            this.broker.setDefault(action);
            return this.createAsyncExceptionHandlingChainActions(func);
        });
    }
}
