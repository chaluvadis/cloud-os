import { Exception } from '../../../../libraries/exceptions/exception';

export class NullFileBodyException extends Exception {
    constructor() {
        super('File body is null.');
    }
}
