import { ErrorConstructor } from '../../models/exception-handling/error-constructor';
import { ExceptionAction } from '../../models/exception-handling/exception-action';
import { IExceptionActionBroker } from './exception-action-broker.interface';

export class ExceptionActionBroker implements IExceptionActionBroker {
    private defaultHandler: ExceptionAction | null | undefined;
    private readonly actionMapping: Map<ErrorConstructor, ExceptionAction>;

    constructor() {
        this.actionMapping = new Map();
        this.defaultHandler = null;
    }

    setDefault(action: ExceptionAction): void {
        this.defaultHandler = action;
    }

    getDefault(): ExceptionAction | null | undefined {
        return this.defaultHandler;
    }

    addAction(pattern: ErrorConstructor, action: ExceptionAction) {
        this.actionMapping.set(pattern, action);
    }

    getAction(pattern: ErrorConstructor) {
        return this.actionMapping.get(pattern);
    }
}
