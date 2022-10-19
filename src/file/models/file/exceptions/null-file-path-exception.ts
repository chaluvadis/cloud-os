import { Exception } from '../../../../libraries/exceptions/exception';

export class NullFilePathException extends Exception {
    constructor() {
        super(`File path is null.`);
    }
}
