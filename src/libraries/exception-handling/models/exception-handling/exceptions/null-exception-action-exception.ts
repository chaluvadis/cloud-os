import { Exception } from '../../../../exceptions/exception';

export class NullExceptionActionException extends Exception {
    constructor() {
        super('Null exception action.');
    }
}
