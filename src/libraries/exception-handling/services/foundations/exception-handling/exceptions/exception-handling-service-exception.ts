import { Exception } from '../../../../../exceptions/exception';

export class ExceptionHandlingServiceException extends Exception {
    constructor(innerException: Exception) {
        super(
            'Exception handling service exception, contact support.',
            innerException
        );
    }
}
