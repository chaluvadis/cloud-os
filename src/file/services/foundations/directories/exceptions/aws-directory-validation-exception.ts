import { Exception } from '../../../../../libraries/exceptions';

export class AWSDirectoryValidationException extends Exception {
    constructor(innerException: Exception) {
        super(
            `AWS directory validation exception, contact support.`,
            innerException
        );
    }
}
