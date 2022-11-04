import { ErrorConstructor } from '../../models/exception-handling/error-constructor';
import { ExceptionAction } from '../../models/exception-handling/exception-action';

export interface IExceptionActionBroker {
    addAction(pattern: ErrorConstructor, action: ExceptionAction): void;
    getAction(pattern: ErrorConstructor): ExceptionAction | undefined | null;
    setDefault(action: ExceptionAction): void;
    getDefault(): ExceptionAction | undefined | null;
}
