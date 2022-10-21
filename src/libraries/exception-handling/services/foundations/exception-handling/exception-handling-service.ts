import { isNil } from '../../../../conditions';
import { Exception } from '../../../../exceptions';
import { ExceptionConstructor } from '../../../../exceptions';
import { ExceptionActionBroker } from '../../../brokers/exception-actions/exception-action-broker';
import { AsyncFunction } from '../../../models/exception-handling/async-function';
import { ExceptionAction } from '../../../models/exception-handling/exception-action';
import { ExceptionHandlingChainActions } from '../../../models/exception-handling/exception-handling-chain-actions';
import { Function } from '../../../models/exception-handling/function';
import { ExceptionHandlingServiceExceptions } from './exception-handling-service.exceptions';
import { ExceptionHandlingServiceValidations } from './exception-handling-service.validations';

export class ExceptionHandlingService<T> {
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

    private createExceptionHandlingChainActions(func: Function<T>) {
        return new ExceptionHandlingChainActions<T>(
            (exceptionPatterns, action) =>
                this.handleCatch(exceptionPatterns, action, func),
            () => this.execute(func)
        );
    }

    private handleCatch(
        exceptionPatternList: ExceptionConstructor[],
        action: ExceptionAction,
        func: Function<T>
    ): ExceptionHandlingChainActions<T> {
        return this.exceptions.tryCatch(() => {
            this.addExceptionPatterns(exceptionPatternList, action);
            return this.createExceptionHandlingChainActions(func);
        });
    }

    private addExceptionPatterns(
        exceptionPatternList: ExceptionConstructor[],
        exceptionAction: ExceptionAction
    ) {
        this.validations.validateExceptionPatterns(exceptionPatternList);
        this.validations.validateExceptionAction(exceptionAction);
        exceptionPatternList.forEach((exceptionConstructor) => {
            this.broker.addAction(exceptionConstructor, exceptionAction);
        });
    }

    private execute(func: Function<T>) {
        try {
            return func();
        } catch (error) {
            throw this.wrapException(Exception.fromError(error));
        }
    }

    private wrapException(exception: Exception) {
        return this.exceptions.tryCatch(() => {
            const exceptionConstructor =
                exception.constructor as ExceptionConstructor;
            const action = this.broker.getAction(exceptionConstructor);
            if (isNil(action)) {
                return exception;
            }
            return action(exception);
        });
    }

    tryCatchAsync(
        func: AsyncFunction<T>
    ): ExceptionHandlingChainActions<Promise<T>> {
        this.validations.validateFunction(func);
        return this.createExceptionHandlingChainActionsAsync(func);
    }

    private createExceptionHandlingChainActionsAsync(func: AsyncFunction<T>) {
        return new ExceptionHandlingChainActions<Promise<T>>(
            (exceptionPatterns, action) =>
                this.handleCatchAsync(exceptionPatterns, action, func),
            () => this.executeAsync(func)
        );
    }

    private handleCatchAsync(
        exceptionPatternList: ExceptionConstructor[],
        action: ExceptionAction,
        func: AsyncFunction<T>
    ): ExceptionHandlingChainActions<Promise<T>> {
        return this.exceptions.tryCatch(() => {
            this.addExceptionPatterns(exceptionPatternList, action);
            return this.createExceptionHandlingChainActionsAsync(func);
        });
    }

    private async executeAsync(func: AsyncFunction<T>): Promise<T> {
        try {
            return await func();
        } catch (error) {
            throw this.wrapException(Exception.fromError(error));
        }
    }
}
