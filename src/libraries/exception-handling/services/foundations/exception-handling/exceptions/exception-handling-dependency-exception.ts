import { Exception } from '../../../../../exceptions/exception';

export class ExceptionHandlingDependencyException extends Exception {
    constructor(innerException: Exception) {
        super(
            'Exception handling dependency exception, contact support.',
            innerException
        );
    }
}
