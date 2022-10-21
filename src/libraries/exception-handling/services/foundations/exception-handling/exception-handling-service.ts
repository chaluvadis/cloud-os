import { isNil } from '../../../../conditions/is-nil';
import { Exception } from '../../../../exceptions/exception';
import { ExceptionConstructor } from '../../../../exceptions/exception-constructor';
import { ExceptionActionBroker } from '../../../brokers/exception-actions/exception-action-broker';
import { AsyncFunction } from '../../../models/exception-handling/async-function';
import { ExceptionAction } from '../../../models/exception-handling/exception-action';
import { ExceptionHandlingChainActions } from '../../../models/exception-handling/exception-handling-chain-actions';
import { NullExceptionActionException } from '../../../models/exception-handling/exceptions/null-exception-action-exception';
import { NullExceptionPatternList } from '../../../models/exception-handling/exceptions/null-exception-pattern-list';
import { NullFunctionException } from '../../../models/exception-handling/exceptions/null-function-exception';
import { Function } from '../../../models/exception-handling/function';
import { ExceptionHandlingServiceExceptions } from './exception-handling-service.exceptions';
import { ExceptionHandlingValidationException } from './exceptions/exception-handling-validation-exception';

export class ExceptionHandlingService<T> {
    private readonly exceptions: ExceptionHandlingServiceExceptions;

    constructor(private readonly broker: ExceptionActionBroker) {
        this.exceptions = new ExceptionHandlingServiceExceptions();
    }

    tryCatch(func: Function<T>): ExceptionHandlingChainActions<T> {
        this.validateFunction(func);
        return new ExceptionHandlingChainActions<T>(
            (exceptionPatterns, action) =>
                this.handleCatch(exceptionPatterns, action, func),
            () => this.execute(func)
        );
    }

    private validateFunction(func: Function<T> | AsyncFunction<T>) {
        if (isNil(func)) {
            const nullException = new NullFunctionException();
            throw new ExceptionHandlingValidationException(nullException);
        }
    }

    private handleCatch(
        exceptionPatternList: ExceptionConstructor[],
        action: ExceptionAction,
        func: Function<T>
    ): ExceptionHandlingChainActions<T> {
        this.addExceptionPatterns(exceptionPatternList, action);
        return new ExceptionHandlingChainActions<T>(
            (newExceptionPatterns, newAction) =>
                this.handleCatch(newExceptionPatterns, newAction, func),
            () => this.execute(func)
        );
    }

    private addExceptionPatterns(
        exceptionPatternList: ExceptionConstructor[],
        exceptionAction: ExceptionAction
    ) {
        this.validateExceptionPatterns(exceptionPatternList);
        this.validateExceptionAction(exceptionAction);
        this.exceptions.tryCatch(() => {
            exceptionPatternList.forEach((exceptionConstructor) => {
                this.broker.addAction(exceptionConstructor, exceptionAction);
            });
        });
    }

    private validateExceptionPatterns(
        exceptionPatternList: ExceptionConstructor[]
    ) {
        if (isNil(exceptionPatternList)) {
            const nullException = new NullExceptionPatternList();
            throw new ExceptionHandlingValidationException(nullException);
        }
    }

    private validateExceptionAction(action: ExceptionAction) {
        if (isNil(action)) {
            throw new ExceptionHandlingValidationException(
                new NullExceptionActionException()
            );
        }
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
        this.validateFunction(func);
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
        this.addExceptionPatterns(exceptionPatternList, action);
        return new ExceptionHandlingChainActions<Promise<T>>(
            (newExceptionPatterns, newAction) =>
                this.handleCatchAsync(newExceptionPatterns, newAction, func),
            () => this.executeAsync(func)
        );
    }

    private async executeAsync(func: AsyncFunction<T>): Promise<T> {
        try {
            return await func();
        } catch (error) {
            throw this.wrapException(Exception.fromError(error));
        }
    }
}
