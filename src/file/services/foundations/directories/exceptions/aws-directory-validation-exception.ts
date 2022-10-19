import { Exception } from '../../../../../libraries/exceptions/exception';

export class AWSDirectoryValidationException extends Exception {
    constructor(innerException: Exception) {
        super(
            `AWS directory validation exception, contact support.`,
            innerException
        );
    }
}
