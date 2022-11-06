import { Exception } from '../../../../../libraries/exceptions';

export class FailedFileRemovalException extends Exception {
    constructor(innerException: Exception) {
        super('Failed file removal exception, contact support.', innerException);
    }
}
