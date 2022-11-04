import { Exception } from '../../../../../libraries/exceptions';

export class AwsFileServiceException extends Exception {
    constructor(innerException: Exception) {
        super('AWS file service exception, contact support.', innerException);
    }
}
