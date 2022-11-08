import { Exception } from '../../../../../libraries/exceptions';

export class AWSDirectoryDependencyException extends Exception {
    constructor(innerException: Exception) {
        super(
            `AWS directory dependency exception, contact support.`,
            innerException
        );
    }
}
