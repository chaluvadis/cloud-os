import { ErrorConstructor } from '../../models/exception-handling/error-constructor';
import { ExceptionAction } from '../../models/exception-handling/exception-action';
import { IExceptionActionBroker } from './exception-action-broker.interface';

export class ExceptionActionBroker implements IExceptionActionBroker {
    private readonly actionMapping: Map<ErrorConstructor, ExceptionAction>;

    constructor() {
        this.actionMapping = new Map();
    }

    addAction(pattern: ErrorConstructor, action: ExceptionAction) {
        this.actionMapping.set(pattern, action);
    }

    getAction(pattern: ErrorConstructor) {
        return this.actionMapping.get(pattern);
    }
}
