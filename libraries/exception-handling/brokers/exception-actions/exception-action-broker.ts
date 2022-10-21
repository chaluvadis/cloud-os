import { ExceptionConstructor } from '../../../exceptions';
import { ExceptionAction } from '../../models/exception-handling/exception-action';

export class ExceptionActionBroker {
    private readonly actionMapping: Map<ExceptionConstructor, ExceptionAction>;

    constructor() {
        this.actionMapping = new Map();
    }

    addAction(pattern: ExceptionConstructor, action: ExceptionAction) {
        this.actionMapping.set(pattern, action);
    }

    getAction(pattern: ExceptionConstructor) {
        return this.actionMapping.get(pattern);
    }
}
