import { Exception } from '../../../../../exceptions';

export class ExceptionHandlingValidationException extends Exception {
    constructor(innerException: Exception) {
        super(
            'Exception handling validation exception, contact support.',
            innerException
        );
    }
}
