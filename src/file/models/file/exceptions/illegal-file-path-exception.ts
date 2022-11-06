import { Exception } from '../../../../libraries/exceptions';
import { ExceptionData } from '../../../../libraries/exceptions/models/exceptions/exception-data';

export class IllegalFilePathException extends Exception {
    constructor(details?: ExceptionData) {
        super('Illegal file path exception, see details.', null, details);
    }
}
