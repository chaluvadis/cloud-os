import { Exception } from '../../../../exceptions';

export class NullExceptionHandlerExecutorException extends Exception {
    constructor() {
        super('Exception handler executor is null.');
    }
}
