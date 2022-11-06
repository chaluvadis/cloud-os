import { Exception } from '../../../../libraries/exceptions';
import { ExceptionData } from '../../../../libraries/exceptions/models/exceptions/exception-data';

export class IllegalFileException extends Exception {
    constructor(details?: ExceptionData) {
        super('File is in an illegal state, see details.', null, details);
    }
}
