import { ExceptionConstructor } from '../../../exceptions';
import { ExceptionAction } from '../../models/exception-handling/exception-action';

export interface IExceptionActionBroker {
    addAction(pattern: ExceptionConstructor, action: ExceptionAction): void;

    getAction(
        pattern: ExceptionConstructor
    ): ExceptionAction | undefined | null;
}
