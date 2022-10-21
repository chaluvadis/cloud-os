import { Exception } from '../../../../../libraries/exceptions';

export class AwsFileValidationException extends Exception {
    constructor(innerException: Exception) {
        super('AWS file validation exception.', innerException);
    }
}
