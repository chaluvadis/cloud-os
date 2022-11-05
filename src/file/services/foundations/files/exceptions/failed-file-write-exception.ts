import { Exception } from '../../../../../libraries/exceptions';

export class FailedFileWriteException extends Exception {
    constructor(innerException: Exception) {
        super('Failed file write exception, contact support.', innerException);
    }
}
