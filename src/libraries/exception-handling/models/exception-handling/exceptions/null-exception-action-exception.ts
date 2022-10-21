import { Exception } from '../../../../exceptions';

export class NullExceptionActionException extends Exception {
    constructor() {
        super('Null exception action.');
    }
}
