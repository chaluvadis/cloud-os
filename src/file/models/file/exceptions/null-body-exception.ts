import { Exception } from '../../../../libraries/exceptions';

export class NullBodyException extends Exception {
    constructor() {
        super('Response body is null.');
    }
}
