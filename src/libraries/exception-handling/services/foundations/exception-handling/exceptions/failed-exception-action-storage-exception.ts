import { Exception } from '../../../../../exceptions/exception';

export class FailedExceptionActionStorageException extends Exception {
    constructor(innerException: Exception) {
        super(
            'Failed exception action storage exception, contact support.',
            innerException
        );
    }
}
