import { Exception } from '../../../../../libraries/exceptions';

export class AWSFileValidationException extends Exception {
    constructor(innerException: Exception) {
        super('AWS file validation exception.', innerException);
    }
}
