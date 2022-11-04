import { Exception } from '../../../../../libraries/exceptions';

export class AWSFileDependencyException extends Exception {
    constructor(innerException: Exception) {
        super(
            'AWS file dependency exception, contact support.',
            innerException
        );
    }
}
