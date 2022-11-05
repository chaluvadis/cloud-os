import { Exception } from '../../../../../libraries/exceptions';

export class AWSFileServiceException extends Exception {
    constructor(innerException: Exception) {
        super('AWS file service exception, contact support.', innerException);
    }
}
